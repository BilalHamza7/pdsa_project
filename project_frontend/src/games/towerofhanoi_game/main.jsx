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
  const [userMoveCount, setUserMoveCount] = useState("");
  const [userMoves, setUserMoves] = useState([]);
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

  const handleMoveCountChange = (e) => {
    const count = parseInt(e.target.value);
    setUserMoveCount(count);
    setUserMoves(Array(count).fill({ disk: "", from: "", to: "" }));
  };

  const handleMoveChange = (index, field, value) => {
    const updatedMoves = [...userMoves];
    updatedMoves[index] = { ...updatedMoves[index], [field]: value };
    setUserMoves(updatedMoves);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName || userMoves.some(move => !move.disk || !move.from || !move.to)) {
      return alert("Please fill all fields correctly.");
    }

    setIsRunning(false);
    const recursiveSolution = solveHanoiRecursive(diskCount, "A", "C", "B");
    const iterativeSolution = solveHanoiIterative(diskCount, "A", "C", "B");

    const formattedUserMoves = userMoves.map(move => `${move.disk} Disk ${move.from.toUpperCase()}→${move.to.toUpperCase()}`);

    const isCorrect =
      formattedUserMoves.length === recursiveSolution.length &&
      JSON.stringify(formattedUserMoves) === JSON.stringify(recursiveSolution);

    setResult({
      playerName,
      diskCount,
      userMoveCount: formattedUserMoves.length,
      userSequence: formattedUserMoves,
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
    setUserMoveCount("");
    setUserMoves([]);
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
      <h2>Tower of Hanoi (3-Peg) </h2>
      <h3>Disks for this round: <strong>{diskCount}</strong></h3>

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
        <p>Player's Name:</p>
        <input
          type="text"
          placeholder="Enter Your Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          required
          disabled={!isStarted}
        />
        <p>Total Number of Moves :</p>
        <input
          type="number"
          placeholder="Enter Your Move Count (e.g. 7)"
          value={userMoveCount}
          onChange={handleMoveCountChange}
          required
          disabled={!isStarted}
          min={1}
        />
        
        <p>Enter your move sequence : </p>
        {userMoves.map((move, index) => (
          
          <div key={index} className="move-input">
          
            <label>Move {index + 1}:</label>
            
            <input
              type="number"
              min="1"
              max={diskCount}
              placeholder="Disk No:"
              value={move.disk}
              onChange={(e) => handleMoveChange(index, "disk", e.target.value)}
              disabled={!isStarted}
              required
            />
            <select
              value={move.from}
              onChange={(e) => handleMoveChange(index, "from", e.target.value)}
              disabled={!isStarted}
              required
            >
              <option value="">From</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
            →
            <select
              value={move.to}
              onChange={(e) => handleMoveChange(index, "to", e.target.value)}
              disabled={!isStarted}
              required
            >
              <option value="">To</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
        ))}

        <button type="submit" disabled={!isStarted}>Submit Answer</button>  
        <button type="button-reset" onClick={resetGame}>Reset</button> 
      </form>

      <h3>⏱️ Time Elapsed: {timer}s</h3>

      {result && (
        <div className="result">
          <h3>Game Result</h3>
          <p><strong>Player:</strong> {result.playerName}</p>
          <p><strong>Disks:</strong> {result.diskCount}</p>
          <p><strong>Result:</strong> {result.isCorrect ? "🏆 WIN" : "❌ Lose"}</p>
          <p><strong>Your Move Count:</strong> {result.userMoveCount}</p>
          <p><strong>Time Taken:</strong> {result.timeTaken}s</p>

          <h4>
            Recursive Solution
            <button onClick={() => setShowRecursive(!showRecursive)} className="toggle-btn">
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
            Iterative Solution
            <button onClick={() => setShowIterative(!showIterative)} className="toggle-btn">
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
