import React, { useState, useEffect } from 'react';


const cities = ["Colombo", "Kandy", "Galle", "Jaffna", "Anuradhapura"];

function getDistance(city1, city2) {
  // Sample distances in km
  const distances = {
    Colombo: { Kandy: 115, Galle: 130, Jaffna: 396, Anuradhapura: 205 },
    Kandy: { Colombo: 115, Galle: 224, Jaffna: 313, Anuradhapura: 137 },
    Galle: { Colombo: 130, Kandy: 224, Jaffna: 491, Anuradhapura: 335 },
    Jaffna: { Colombo: 396, Kandy: 313, Galle: 491, Anuradhapura: 197 },
    Anuradhapura: { Colombo: 205, Kandy: 137, Galle: 335, Jaffna: 197 }
  };
  return distances[city1]?.[city2] || distances[city2]?.[city1] || Infinity;
}

function nearestNeighbor(cities, start) {
  const visited = new Set();
  const path = [start];
  let current = start;
  visited.add(current);
  while (visited.size < cities.length) {
    let nextCity = null;
    let minDistance = Infinity;
    for (let city of cities) {
      if (!visited.has(city)) {
        const dist = getDistance(current, city);
        if (dist < minDistance) {
          minDistance = dist;
          nextCity = city;
        }
      }
    }
    if (nextCity) {
      path.push(nextCity);
      visited.add(nextCity);
      current = nextCity;
    }
  }
  path.push(start); // return to start
  return path;
}

export default function Main() {
  const [name, setName] = useState('');
  const [startCity, setStartCity] = useState('');
  const [result, setResult] = useState([]);
  const [error, setError] = useState('');
  const [db, setDb] = useState([]); // mock database

  useEffect(() => {
    const randomHome = cities[Math.floor(Math.random() * cities.length)];
    setStartCity(randomHome);
  }, []);

  const handleSubmit = () => {
    setError('');
    if (!name || !startCity) {
      setError("Name and starting city are required.");
      return;
    }
    try {
      const path = nearestNeighbor(cities, startCity);
      setResult(path);
      const entry = { name, response: path.join(" -> ") };
      setDb(prev => [...prev, entry]); // save to db
    } catch (e) {
      setError("An error occurred during processing.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Traveling Salesman Problem</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Home City (randomized): <strong>{startCity}</strong></p>
      <button onClick={handleSubmit}>Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result.length > 0 && (
        <div>
          <h4>Path:</h4>
          <p>{result.join(" -> ")}</p>
        </div>
      )}
      <hr />
      <h3>Responses</h3>
      <ul>
        {db.map((entry, i) => (
          <li key={i}>{entry.name}: {entry.response}</li>
        ))}
      </ul>
    </div>
  );
}

// Unit Test Example (Mock in test suite):
// expect(nearestNeighbor(["A", "B", "C"], "A")).toEqual(["A", "B", "C", "A"]);

/* DB Structure (Normalized)
Table: Responses
- id (PK)
- name (TEXT)
- response (TEXT)
*/
