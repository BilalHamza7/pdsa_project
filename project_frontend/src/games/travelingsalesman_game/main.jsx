import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import MapVisualizer from './MapVisualizer';

const cities = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const generateDistanceMatrix = () => {
  const matrix = Array(10).fill(null).map(() => Array(10).fill(0));
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (i !== j) matrix[i][j] = Math.floor(Math.random() * 51) + 50;
    }
  }
  return matrix;
};

const tspDijkstra = (start, selectedCities, matrix) => {
  const n = selectedCities.length;
  let route = [start];
  let visited = new Set([start]);
  let current = start;
  let totalDistance = 0;

  while (visited.size - 1 < n) {
    let minDist = Infinity;
    let nextCity = null;

    for (let city of selectedCities) {
      if (!visited.has(city) && matrix[current][city] < minDist) {
        minDist = matrix[current][city];
        nextCity = city;
      }
    }

    if (nextCity !== null) {
      route.push(nextCity);
      visited.add(nextCity);
      totalDistance += minDist;
      current = nextCity;
    } else {
      break;
    }
  }

  totalDistance += matrix[current][start];
  route.push(start);

  return { route, distance: totalDistance };
};

const tspNearestNeighbor = (start, selectedCities, matrix) => {
  let route = [start];
  let visited = new Set([start]);
  let current = start, total = 0;

  while (visited.size - 1 < selectedCities.length) {
    let minDist = Infinity, nextCity = null;
    for (let city of selectedCities) {
      if (!visited.has(city) && matrix[current][city] < minDist) {
        minDist = matrix[current][city];
        nextCity = city;
      }
    }
    if (nextCity !== null) {
      route.push(nextCity);
      visited.add(nextCity);
      total += minDist;
      current = nextCity;
    }
  }
  total += matrix[current][start];
  route.push(start);
  return { route, distance: total };
};

const tspDynamicProgramming = (start, selectedCities, matrix) => {
  const n = selectedCities.length;
  const memo = {};

  const dp = (pos, visited) => {
    const key = `${pos}|${visited}`;
    if (memo[key]) return memo[key];

    if (visited === (1 << n) - 1) return matrix[selectedCities[pos]][start];

    let min = Infinity;
    for (let i = 0; i < n; i++) {
      if (!(visited & (1 << i))) {
        const dist = matrix[selectedCities[pos]][selectedCities[i]] + dp(i, visited | (1 << i));
        min = Math.min(min, dist);
      }
    }
    memo[key] = min;
    return min;
  };

  let minDistance = Infinity;
  for (let i = 0; i < n; i++) {
    const distance = matrix[start][selectedCities[i]] + dp(i, 1 << i);
    if (distance < minDistance) minDistance = distance;
  }

  return { distance: minDistance, route: [start, ...selectedCities, start] };
};

export default function Main() {
  const [distanceMatrix, setDistanceMatrix] = useState([]);
  const [homeCity, setHomeCity] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [playerPath, setPlayerPath] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [pathFeedback, setPathFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [recentGames, setRecentGames] = useState([]);

  useEffect(() => {
    const matrix = generateDistanceMatrix();
    setDistanceMatrix(matrix);
    const randomHome = Math.floor(Math.random() * cities.length);
    setHomeCity(randomHome);
    fetchRecentGames();
  }, []);

  const fetchRecentGames = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_salesman_gamesessions')
        .select('player_name, home_city, selected_cities, player_route, distance, status')
      if (error) throw error;
      setRecentGames(data);
      console.log('Recent games fetched:', data);
    } catch (err) {
      console.error('Error fetching recent games:', err);
      setError('Failed to fetch recent games: ' + err.message);
    }
  };

  const handleSelectCity = (index) => {
    if (selectedCities.includes(index)) {
      setSelectedCities(selectedCities.filter((c) => c !== index));
    } else {
      setSelectedCities([...selectedCities, index]);
    }
  };

  const handleSubmit = () => {
    try {
      setError('');
      if (!playerName) throw new Error("Player name is required.");
      if (selectedCities.length < 2) throw new Error("Select at least 2 cities.");
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const saveToSupabase = async (playerName, gameData, algorithmStats) => {
    try {
      const { data: session, error: sessionError } = await supabase
        .from('travel_salesman_gamesessions')
        .insert([{
          player_name: playerName,
          home_city: gameData.homeCity,
          selected_cities: gameData.selectedCities,
          player_route: gameData.shortestRoute,
          distance: gameData.distance,
          status: gameData.status,
        }])
        .select('session_id')
        .single();
      if (sessionError) throw sessionError;

      const sessionId = session.session_id;

      const algoStats = [
        { session_id: sessionId, algorythm_name: 'Dijkstra', time_taken_ms: parseFloat(algorithmStats.times.dijkstra), distance: algorithmStats.dijkstra.distance },
        { session_id: sessionId, algorythm_name: 'Nearest Neighbor', time_taken_ms: parseFloat(algorithmStats.times.nearest), distance: algorithmStats.nearest.distance },
        { session_id: sessionId, algorythm_name: 'Dynamic Programming', time_taken_ms: parseFloat(algorithmStats.times.dp), distance: algorithmStats.dp.distance },
      ];

      const { error: statsError } = await supabase
        .from('travel_salesman_AlgorithmStats')
        .insert(algoStats);
      if (statsError) throw statsError;

      // Refresh recent games after saving
      await fetchRecentGames();
    } catch (err) {
      console.error('Error saving to Supabase:', err);
      setError('Failed to save game data: ' + err.message);
    }
  };

  const handleCheckPath = async () => {
    try {
      setError('');
      setPathFeedback('');
      if (!playerPath) throw new Error("Please enter a path.");
      const inputCities = playerPath.split(',').map((c) => c.trim().toUpperCase());
      const selectedCityNames = selectedCities.map((i) => cities[i]);
      const invalidCities = inputCities.filter((c) => !selectedCityNames.includes(c));
      if (invalidCities.length > 0) throw new Error(`Invalid cities: ${invalidCities.join(', ')}`);
      if (new Set(inputCities).size !== inputCities.length) throw new Error("Duplicate cities in path.");
      if (inputCities.length !== selectedCities.length) throw new Error("Path must include all selected cities exactly once.");

      const cityToIndex = Object.fromEntries(cities.map((c, i) => [c, i]));
      const playerRouteIndices = inputCities.map((c) => cityToIndex[c]);
      let playerDistance = 0;
      let current = homeCity;
      for (let city of playerRouteIndices) {
        playerDistance += distanceMatrix[current][city];
        current = city;
      }
      playerDistance += distanceMatrix[current][homeCity];

      const start = homeCity;

      const t0 = performance.now();
      const dijkstra = tspDijkstra(start, selectedCities, distanceMatrix);
      const t1 = performance.now();

      const t2 = performance.now();
      const nearest = tspNearestNeighbor(start, selectedCities, distanceMatrix);
      const t3 = performance.now();

      const t4 = performance.now();
      const dp = tspDynamicProgramming(start, selectedCities, distanceMatrix);
      const t5 = performance.now();

      const resultData = {
        playerName,
        homeCity: cities[homeCity],
        selected: selectedCities.map((i) => cities[i]),
        dijkstra,
        nearest,
        dp,
        times: {
          dijkstra: (t1 - t0).toFixed(2),
          nearest: (t3 - t2).toFixed(2),
          dp: (t5 - t4).toFixed(2),
        },
      };

      setResults(resultData);

      const optimalDistance = dijkstra.distance;
      const optimalRoute = dijkstra.route.map((i) => cities[i]);
      let status = 'incorrect';
      if (playerDistance === optimalDistance) {
        status = 'correct';
        setPathFeedback(`Correct! Your path distance (${playerDistance} km) matches the optimal distance.`);
      } else {
        setPathFeedback(
          `Incorrect. Your path distance is ${playerDistance} km, but the optimal distance is ${optimalDistance} km. Correct path: ${optimalRoute.join(' → ')}`
        );
      }

      const gameData = {
        homeCity: cities[homeCity],
        selectedCities: selectedCities.map((i) => cities[i]),
        shortestRoute: inputCities,
        distance: playerDistance,
        status: status,
      };

      await saveToSupabase(playerName, gameData, resultData);

    } catch (err) {
      setError(err.message);
      const start = homeCity;
      const t0 = performance.now();
      const dijkstra = tspDijkstra(start, selectedCities, distanceMatrix);
      const t1 = performance.now();
      const t2 = performance.now();
      const nearest = tspNearestNeighbor(start, selectedCities, distanceMatrix);
      const t3 = performance.now();
      const t4 = performance.now();
      const dp = tspDynamicProgramming(start, selectedCities, distanceMatrix);
      const t5 = performance.now();

      const resultData = {
        playerName,
        homeCity: cities[homeCity],
        selected: selectedCities.map((i) => cities[i]),
        dijkstra,
        nearest,
        dp,
        times: {
          dijkstra: (t1 - t0).toFixed(2),
          nearest: (t3 - t2).toFixed(2),
          dp: (t5 - t4).toFixed(2),
        },
      };
      setResults(resultData);
    }
  };

  const resetGame = () => {
    setDistanceMatrix(generateDistanceMatrix());
    setHomeCity(Math.floor(Math.random() * cities.length));
    setSelectedCities([]);
    setPlayerName('');
    setPlayerPath('');
    setResults(null);
    setError('');
    setPathFeedback('');
    setIsSubmitted(false);
  };

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "auto",
      padding: "20px",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#1F2937",
      backgroundColor: "aquamarine",
      marginTop: "20px",
    },
    heading: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#111827",
      fontSize: "26px",
    },
    card: {
      backgroundColor: "#F9FAFB",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.06)",
      marginBottom: "20px",
      marginTop: "20px",
    },
    section: {
      marginBottom: "15px",
      marginTop: "15px",
    },
    cityName: {
      fontWeight: "bold",
      color: "#3B82F6",
    },
    input: {
      display: "block",
      marginTop: "8px",
      padding: "8px",
      width: "100%",
      borderRadius: "8px",
      border: "1px solid #D1D5DB",
      fontSize: "16px",
    },
    checkboxContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginTop: "10px",
    },
    checkboxItem: {
      backgroundColor: "#E5E7EB",
      padding: "6px 12px",
      borderRadius: "6px",
    },
    button: {
      marginTop: "10px",
      padding: "10px 20px",
      backgroundColor: "#3B82F6",
      color: "#FFFFFF",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "0.3s",
    },
    error: {
      color: "#DC2626",
      marginTop: "10px",
    },
    resultBox: {
      backgroundColor: "#FEF3C7",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "20px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    },
    resultHeading: {
      fontSize: "20px",
      marginBottom: "12px",
      color: "#92400E",
    },
    feedback: {
      fontStyle: "italic",
      color: "#6B7280",
      marginBottom: "12px",
    },
    recentGamesBox: {
      backgroundColor: "#E5E7EB",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "20px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    },
    recentGamesHeading: {
      fontSize: "20px",
      marginBottom: "12px",
      color: "#1F2937",
    },
    gameItem: {
      padding: "10px",
      borderBottom: "1px solid #D1D5DB",
      marginBottom: "10px",
    },
    gameDetail: {
      fontSize: "14px",
      color: "#4B5563",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🗺️ Traveling Salesman Problem Visualizer</h2>
      <MapVisualizer
        cities={cities}
        distanceMatrix={distanceMatrix}
        homeCity={homeCity}
        selectedCities={selectedCities}
      />
      <div style={styles.card}>
        <div style={styles.section}>
          <strong>🏡 Home City:</strong>{" "}
          <span style={styles.cityName}>
            {homeCity !== null && cities[homeCity]}
          </span>
        </div>

        <div style={styles.section}>
          <label>
            <strong>🧑 Enter your name:</strong>
            <input
              type="text"
              placeholder="Player Name"
              style={styles.input}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </label>
        </div>

        <div style={styles.section}>
          <strong>🏙️ Select cities to visit:</strong>
          <div style={styles.checkboxContainer}>
            {cities.map((c, i) =>
              i !== homeCity ? (
                <label key={i} style={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={selectedCities.includes(i)}
                    onChange={() => handleSelectCity(i)}
                  />{" "}
                  {c}
                </label>
              ) : null
            )}
          </div>
        </div>

        <button onClick={handleSubmit} style={styles.button}>
          🚀 Submit
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </div>

      {isSubmitted && !results && (
        <div style={styles.card}>
          <label>
            <strong>📝 Enter your proposed path (e.g., A,B,C):</strong>
            <input
              type="text"
              placeholder="Enter path"
              style={styles.input}
              value={playerPath}
              onChange={(e) => setPlayerPath(e.target.value)}
            />
          </label>
          <button onClick={handleCheckPath} style={styles.button}>
            ✅ Check Path
          </button>
        </div>
      )}

      {results && (
        <div style={styles.resultBox}>
          <h4 style={styles.resultHeading}>🎯 Results for {results.playerName}</h4>
          <p style={styles.feedback}>{pathFeedback}</p>
          <p>
            <strong>🔍 Dijkstra:</strong> {results.dijkstra.distance} km — Route:{" "}
            {results.dijkstra.route.map((i) => cities[i]).join(" → ")}
          </p>
          <p>
            <strong>📍 Nearest Neighbor:</strong> {results.nearest.distance} km — Route:{" "}
            {results.nearest.route.map((i) => cities[i]).join(" → ")}
          </p>
          <p>
            <strong>🧠 Dynamic Programming:</strong> {results.dp.distance} km — Route:{" "}
            {results.dp.route.map((i) => cities[i]).join(" → ")}
          </p>
          <p>
            <strong>⏱️ Execution Times (ms):</strong> Dijkstra: {results.times.dijkstra}, Nearest:{" "}
            {results.times.nearest}, DP: {results.times.dp}
          </p>
        </div>
      )}

      <div style={styles.recentGamesBox}>
        <h4 style={styles.recentGamesHeading}>📜 Recent Games</h4>
        {recentGames.length === 0 ? (
          <p style={styles.gameDetail}>No games played yet.</p>
        ) : (
          recentGames.map((game, index) => (
            <div key={index} style={styles.gameItem}>
              <p style={styles.gameDetail}>
                <strong>Player:</strong> {game.player_name}
              </p>
              <p style={styles.gameDetail}>
                <strong>Home City:</strong> {game.home_city}
              </p>
              <p style={styles.gameDetail}>
                <strong>Selected Cities:</strong> {game.selected_cities.join(', ')}
              </p>
              <p style={styles.gameDetail}>
                <strong>Route:</strong> {game.player_route.join(' → ')}
              </p>
              <p style={styles.gameDetail}>
                <strong>Distance:</strong> {game.distance} km
              </p>
              <p style={styles.gameDetail}>
                <strong>Status:</strong> {game.status}
              </p>
              <p style={styles.gameDetail}>
                <strong>Played:</strong> {new Date(game.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      <button
        onClick={resetGame}
        style={{
          ...styles.button,
          backgroundColor: "#6B7280",
          marginTop: 20,
          color: "#fff",
        }}
      >
        🔄 New Game
      </button>
    </div>
  );
}