import React, { useState, useEffect } from 'react';

const cities = ['A','B','C','D','E','F','G','H','I','J'];

const generateDistanceMatrix = () => {
  const matrix = Array(10).fill(null).map(() => Array(10).fill(0));
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (i !== j) matrix[i][j] = Math.floor(Math.random() * 51) + 50;
    }
  }
  return matrix;
};

const tspBruteForce = (start, selectedCities, matrix) => {
  const permutations = (arr) => {
    if (arr.length === 0) return [[]];
    const result = [];
    arr.forEach((v, i) => {
      const rest = arr.slice(0, i).concat(arr.slice(i + 1));
      const sub = permutations(rest);
      sub.forEach((s) => result.push([v].concat(s)));
    });
    return result;
  };

  const routes = permutations(selectedCities);
  let minRoute = null, minDistance = Infinity;

  routes.forEach((route) => {
    let dist = 0;
    let current = start;
    route.forEach((city) => {
      dist += matrix[current][city];
      current = city;
    });
    dist += matrix[current][start];
    if (dist < minDistance) {
      minDistance = dist;
      minRoute = route;
    }
  });

  return { route: minRoute, distance: minDistance };
};

const tspNearestNeighbor = (start, selectedCities, matrix) => {
  let route = [], visited = new Set();
  let current = start, total = 0;

  while (visited.size < selectedCities.length) {
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

  return { distance: minDistance, route: selectedCities }; // Approx route only
};

export default function Main() {
  const [distanceMatrix, setDistanceMatrix] = useState([]);
  const [homeCity, setHomeCity] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const matrix = generateDistanceMatrix();
    setDistanceMatrix(matrix);
    const randomHome = Math.floor(Math.random() * cities.length);
    setHomeCity(randomHome);
  }, []);

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

      const start = homeCity;

      const t0 = performance.now();
      const brute = tspBruteForce(start, selectedCities, distanceMatrix);
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
        brute,
        nearest,
        dp,
        times: {
          brute: (t1 - t0).toFixed(2),
          nearest: (t3 - t2).toFixed(2),
          dp: (t5 - t4).toFixed(2),
        }
      };

      setResults(resultData);

    } catch (err) {
      setError(err.message);
    }
  };

  const styles = {
    container: { padding: 20, fontFamily: 'Arial, sans-serif', maxWidth: 800, margin: '0 auto' },
    heading: { fontSize: 26, marginBottom: 10 },
    section: { marginBottom: 20 },
    input: { padding: 8, width: '100%', marginTop: 5, marginBottom: 10, fontSize: 16 },
    checkboxContainer: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
    checkboxItem: { width: 'fit-content' },
    button: {
      padding: '10px 20px',
      backgroundColor: '#007BFF',
      color: 'white',
      border: 'none',
      borderRadius: 5,
      fontSize: 16,
      cursor: 'pointer'
    },
    error: { color: 'red' },
    resultBox: { backgroundColor: '#f4f4f4', padding: 15, borderRadius: 10, marginTop: 20 }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Traveling Salesman Problem Visualizer</h2>
      <div style={styles.section}>
        <strong>Home City:</strong> {homeCity !== null && cities[homeCity]}
      </div>

      <div style={styles.section}>
        <label>
          <strong>Enter your name:</strong>
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
        <strong>Select cities to visit:</strong>
        <div style={styles.checkboxContainer}>
          {cities.map((c, i) => (
            i !== homeCity && (
              <label key={i} style={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={selectedCities.includes(i)}
                  onChange={() => handleSelectCity(i)}
                /> {c}
              </label>
            )
          ))}
        </div>
      </div>

      <button onClick={handleSubmit} style={styles.button}>Find Shortest Route</button>
      {error && <p style={styles.error}>{error}</p>}

      {results && (
        <div style={styles.resultBox}>
          <h4>Results for {results.playerName}</h4>
          <p><strong>Brute Force:</strong> {results.brute.distance} km — Route: {results.brute.route.map(i => cities[i]).join(" → ")}</p>
          <p><strong>Nearest Neighbor:</strong> {results.nearest.distance} km — Route: {results.nearest.route.map(i => cities[i]).join(" → ")}</p>
          <p><strong>Dynamic Programming:</strong> {results.dp.distance} km</p>
          <p><strong>Execution Times (ms):</strong> Brute: {results.times.brute}, Nearest: {results.times.nearest}, DP: {results.times.dp}</p>
        </div>
      )}
    </div>
  );
}
