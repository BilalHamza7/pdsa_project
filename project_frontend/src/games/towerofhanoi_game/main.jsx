import React, { useState, useEffect } from "react";
import {
  solveHanoiRecursive,
  solveHanoiIterative,
} from "./hanoiAlgorithms";
import "./TowerOfHanoi.css";

// Generate a random number between 5 and 10
const getRandomDisks = () => Math.floor(Math.random() * 6) + 5;

const TowerOfHanoi = () => {
  const [diskCount, setDiskCount] = useState(getRandomDisks());
  const [playerName, setPlayerName] = useState("");
  const [userMoves, setUserMoves] = useState("");
  const [userMoveCount, setUserMoveCount] = useState("");
  const [result, setResult] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showRecursive, setShowRecursive] = useState(false);
  const [showIterative, setShowIterative] = useState(false);


  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else if (!isRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  // Start timer on load
  useEffect(() => {
    setIsRunning(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsRunning(false);

    // Solve using recursive + iterative
    const recursiveSolution = solveHanoiRecursive(diskCount, "A", "C", "B");
    const iterativeSolution = solveHanoiIterative(diskCount, "A", "C", "B");

    // Format user moves
    const userSequence = userMoves
      .split(",")
      .map((m) => m.trim().toUpperCase());

    // Compare move count and sequence
    const isCorrect =
      parseInt(userMoveCount) === recursiveSolution.length &&
      JSON.stringify(userSequence) === JSON.stringify(recursiveSolution);

    // Result to display (DB save handled in backend)
    setResult({
        playerName,
        diskCount,
        userMoveCount: parseInt(userMoveCount),
        userSequence,
        isCorrect,
        timeTaken: timer,
        recursiveTime: recursiveSolution.length,
        iterativeTime: iterativeSolution.length,
        recursiveSolution,
        iterativeSolution,
      });
      


    // Optionally: call your backend API to save result
  };

  const resetGame = () => {
    setDiskCount(getRandomDisks());
    setPlayerName("");
    setUserMoves("");
    setUserMoveCount("");
    setResult(null);
    setTimer(0);
    setIsRunning(true);
  };

  return (
    <div className="hanoi-container">
      <h2>🗼 Tower of Hanoi (3-Peg - Text Version)</h2>
      <p>Disks this round: <strong>{diskCount}</strong></p>
      <p>Enter move sequence in format like: <em>A→C, A→B, B→C...</em></p>

      <form onSubmit={handleSubmit} className="hanoi-form">
        <input
          type="text"
          placeholder="Your Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Your Move Count"
          value={userMoveCount}
          onChange={(e) => setUserMoveCount(e.target.value)}
          required
        />
        <textarea
          placeholder="Move Sequence (e.g. A→C, A→B...)"
          value={userMoves}
          onChange={(e) => setUserMoves(e.target.value)}
          required
          rows={4}
        />
        <button type="submit">Submit Answer</button>
        <button type="button" onClick={resetGame}>Reset</button>
      </form>

      <p>⏱️ Time Elapsed: <strong>{timer}s</strong></p>

      {result && (
  <div className="result">
    <h3>Game Result</h3>
    <p><strong>Player:</strong> {result.playerName}</p>
    <p><strong>Disks:</strong> {result.diskCount}</p>
    <p><strong>Correct:</strong> {result.isCorrect ? "✅ Yes" : "❌ No"}</p>
    <p><strong>Your Move Count:</strong> {result.userMoveCount}</p>
    <p><strong>Time Taken:</strong> {result.timeTaken}s</p>

    <h4>
  🔁 Recursive Solution
  <button
    onClick={() => setShowRecursive(!showRecursive)}
    className="toggle-btn"
  >
    {showRecursive ? "Hide" : "Show"}
  </button>
</h4>
<p><strong>Total Moves:</strong> {result.recursiveTime}</p>
{showRecursive && (
  <ol>
    {result.recursiveSolution.map((move, index) => (
      <li key={index}>{move}</li>
    ))}
  </ol>
)}

<h4>
  🔂 Iterative Solution
  <button
    onClick={() => setShowIterative(!showIterative)}
    className="toggle-btn"
  >
    {showIterative ? "Hide" : "Show"}
  </button>
</h4>
<p><strong>Total Moves:</strong> {result.iterativeTime}</p>
{showIterative && (
  <ol>
    {result.iterativeSolution.map((move, index) => (
      <li key={index}>{move}</li>
    ))}
  </ol>
)}

  </div>
)}

    </div>
  );
};

export default TowerOfHanoi;
