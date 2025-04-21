import React, { useState, useEffect } from "react";
import {
  solveHanoiRecursive,
  solveHanoiIterative,
  solveHanoi4Pegs,
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
  const [fourPegMoves, setFourPegMoves] = useState([]);
  const [diskCount4Peg, setDiskCount4Peg] = useState(0);
  const [playerName4Peg, setPlayerName4Peg] = useState("");

  const [userMoveCount4Peg, setUserMoveCount4Peg] = useState("");
  const [userMoves4Peg, setUserMoves4Peg] = useState([]);
  const [isRunning4, setIsRunning4] = useState(false);
  const [isStarted4, setIsStarted4] = useState(false);

  

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

  const handleStart4peg = () => {
    setIsStarted4(true);
    setIsRunning4(true);
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
    // Measure Recursive Time
    const t0Recursive = performance.now();
    const recursiveSolution = solveHanoiRecursive(diskCount, "A", "C", "B");
    const t1Recursive = performance.now();
    const recursiveTimeMs = (t1Recursive - t0Recursive).toFixed(2);

    // Measure Iterative Time
    const t0Iterative = performance.now();
    const iterativeSolution = solveHanoiIterative(diskCount, "A", "C", "B");
    const t1Iterative = performance.now();
    const iterativeTimeMs = (t1Iterative - t0Iterative).toFixed(2);

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
      recursiveTimeMs,
      iterativeTimeMs,
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

//4-Peg Tower of Hanoi (Frame-Stewart Algorithm)

  const start4PegGame = () => {
    const randomDisks = Math.floor(Math.random() * 6) + 5; // 5–10
    setDiskCount4Peg(randomDisks);

    const moves = solveHanoi4Pegs(randomDisks, "A", "B", "C", "D");
    setFourPegMoves(moves);
  };
  
  const reset4PegGame = () => {
  setDiskCount4Peg(0);
  setPlayerName4Peg("");
  setFourPegMoves([]);
  setUserMoveCount4Peg("");
  setUserMoves4Peg([]);
  setIsStarted4(false);
  setIsRunning4(tfalse);
};

// Handle user input for move count in 4-peg game
const handle4PegMoveCountChange = (e) => {
  const count = parseInt(e.target.value); // Parse input to integer
  setUserMoveCount4Peg(count); // Set the user move count for 4-peg game
  setUserMoves4Peg(Array(count).fill({ disk: "", from: "", to: "" })); // Initialize empty move sequence
};

// Handle user input for moves in 4-peg game
const handle4PegMoveChange = (index, field, value) => {
  const updatedMoves = [...userMoves4Peg]; // Copy existing moves
  updatedMoves[index] = { ...updatedMoves[index], [field]: value }; // Update specific move field
  setUserMoves4Peg(updatedMoves); // Update the state
};

const handle4PegSubmit = (e) => {
  e.preventDefault(); // Prevent default form submission
  // Validate user input
  if (!playerName4Peg || userMoves4Peg.some((move) => !move.disk || !move.from || !move.to)) {
    return alert("Please fill all fields correctly.");
  }

 // Format the user moves for 4-peg game
 const formattedUserMoves4Peg = userMoves4Peg.map(
  (move) => `${move.disk} Disk ${move.from.toUpperCase()}→${move.to.toUpperCase()}`
);

// Compare user moves with the correct 4-peg moves and check correctness
const is4PegCorrect =
  formattedUserMoves4Peg.length === fourPegMoves.length &&
  JSON.stringify(formattedUserMoves4Peg) === JSON.stringify(fourPegMoves);

// Set the result for 4-peg game
setResult({
  playerName: playerName4Peg,
  diskCount: diskCount4Peg,
  userMoveCount: formattedUserMoves4Peg.length,
  userSequence: formattedUserMoves4Peg,
  isCorrect: is4PegCorrect,
  timeTaken: timer,
});
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

        <button type="submit" disabled={!isStarted} >Submit Answer</button>  
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
          <p><strong>Execution Time:</strong> {result.recursiveTimeMs} ms</p>

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
          <p><strong>Execution Time:</strong> {result.iterativeTimeMs} ms</p>

          {showIterative && (
            <ol>
              {result.iterativeSolution.map((move, index) => (
                <li key={index}>{move}</li>
              ))}
            </ol>
          )}
        </div>  
      )}  
      



      {/* 4-Peg Tower of Hanoi Section */}
<div className="hanoi-section">
  <h2>4-Peg Tower of Hanoi (Frame-Stewart Algorithm)</h2>
  <h3>Disks for this round: <strong>{diskCount}</strong></h3>

  {!isStarted4 && <button className="start-btn" onClick={handleStart4peg}>Start Game</button>}

  <form onSubmit={handleSubmit} className="hanoi-form">

    
        <p>Player's Name:</p>
        <input
          type="text"
          placeholder="Enter Your Name"
          value={playerName4Peg}
          onChange={(e) => setPlayerName4Peg(e.target.value)}
          required
          disabled={!isStarted4}
        />

        <p>Total Number of Moves :</p>
        <input
          type="number"
          placeholder="Enter Your Move Count (e.g. 7)"
          value={userMoveCount4Peg}
          onChange={handle4PegMoveCountChange} // Handle move count for 4-peg
          //max={Math.pow(2, diskCount4Peg) - 1}  Max number of moves is 2^n-1
          required
          min="1"
          disabled={!isStarted4}
        />

       <p>Enter your move sequence : </p>
       <div>  
          {/* Render dynamic input fields for each move */}
          {userMoves4Peg.map((move, index) => (
            <div key={index} className="move-input"> 
            <label>Move {index + 1}:</label>
              <input
                type="number"
                placeholder={`Disk No`}
                value={move.disk}
                onChange={(e) =>
                  handle4PegMoveChange(index, "disk", e.target.value) // Handle disk input for 4-peg move
                }
                disabled={!isStarted4}
              />

              <select
              type="text"
              value={move.from}
              onChange={(e) =>
                handle4PegMoveChange(index, "from", e.target.value)} // Handle "from" input for 4-peg move
              placeholder="From"
              required
              disabled={!isStarted4}
            >
              <option value="">From</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="C">D</option>
            </select>
              
              →
              <select
              type="text"
              value={move.to}
              onChange={(e) =>
                handle4PegMoveChange(index, "to", e.target.value) // Handle "to" input for 4-peg move
              }
              required
              disabled={!isStarted4}
            >
              <option value="">To</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="C">D</option>
            </select>

            </div>
          ))}
        </div>
        
        <button type="submit" disabled={!isStarted4} > Submit Answer</button> 
        
        
        <button onClick={reset4PegGame}>Reset 4-Peg Game</button>

        </form>

  
 
</div>


   
    </div> 
  );
  
};


export default TowerOfHanoi;
