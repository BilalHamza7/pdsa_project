import React, { useState, useEffect } from "react";
import {
  solveHanoiRecursive,
  solveHanoiIterative,
} from "./hanoiAlgorithms";
import "./TowerOfHanoi.css";

const getRandomDisks = () => Math.floor(Math.random() * 6) + 5;

const TowerOfHanoi = () => {
  const [diskCount, setDiskCount] = useState(getRandomDisks());
  const [playerName, setPlayerName] = useState("");
  const [userMoves, setUserMoves] = useState("");
  const [userMoveCount, setUserMoveCount] = useState("");
  const [result, setResult] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [showRecursive, setShowRecursive] = useState(false);
  const [showIterative, setShowIterative] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setIsStarted(true);
    setIsRunning(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName || !userMoves || !userMoveCount) return alert("Please fill all fields.");

    setIsRunning(false);
    const recursiveSolution = solveHanoiRecursive(diskCount, "A", "C", "B");
    const iterativeSolution = solveHanoiIterative(diskCount, "A", "C", "B");

    const userSequence = userMoves.split(",").map((m) => m.trim().toUpperCase());

    const isCorrect =
      parseInt(userMoveCount) === recursiveSolution.length &&
      JSON.stringify(userSequence) === JSON.stringify(recursiveSolution);

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
  };

  const resetGame = () => {
    setDiskCount(getRandomDisks());
    setPlayerName("");
    setUserMoves("");
    setUserMoveCount("");
    setResult(null);
    setTimer(0);
    setIsStarted(false);
    setIsRunning(false);
  };

  const getDiskColor = (size) => {
    const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#9D4EDD", "#FF8E00", "#2EC4B6", "#8D6E63", "#00B8D9", "#FF69B4"];
    return colors[(size - 1) % colors.length];
  };

  return (
    <div className="hanoi-container">
      <h2>🗼 Tower of Hanoi (3-Peg - Text + Visual)</h2>
      <p>Disks this round: <strong>{diskCount}</strong></p>

      <div className="visual-board">
        {["A", "B", "C"].map((peg, pegIndex) => (
          <div className="peg" key={pegIndex}>
            <div className="peg-bar" />
            <div className="peg-label">{peg}</div>
            {peg === "A" &&
              isStarted &&
              Array.from({ length: diskCount }, (_, i) => {
                const size = diskCount - i;
                return (
                  <div
                    key={size}
                    className="disk"
                    style={{
                      width: `${size * 20 + 40}px`,
                      backgroundColor: getDiskColor(size),
                    }}
                  >
                    {size}
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      {!isStarted && <button className="start-btn" onClick={handleStart}>Start Game</button>}

      <form onSubmit={handleSubmit} className="hanoi-form">
        <input
          type="text"
          placeholder="Your Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          required
          disabled={!isStarted}
        />
        <input
          type="number"
          placeholder="Your Move Count"
          value={userMoveCount}
          onChange={(e) => setUserMoveCount(e.target.value)}
          required
          disabled={!isStarted}
        />
        <textarea
          placeholder="Move Sequence (e.g. A→C, A→B...)"
          value={userMoves}
          onChange={(e) => setUserMoves(e.target.value)}
          required
          rows={4}
          disabled={!isStarted}
        />
        <button type="submit" disabled={!isStarted}>Submit Answer</button>
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
