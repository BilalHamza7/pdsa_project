import React, { useState, useEffect } from "react";
import {
  solveHanoiRecursive,
  solveHanoiIterative,
  solveHanoi4Pegs,
} from "./hanoiAlgorithms"; 
import "./TowerOfHanoi.css"; 


const getRandomDisks = () => Math.floor(Math.random() * 6) + 5;

const TowerOfHanoi = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [diskCount, setDiskCount] = useState(getRandomDisks());
  const [playerName, setPlayerName] = useState("");
  const [userMoveCount, setUserMoveCount] = useState(0);
  const [userMoves, setUserMoves] = useState([]);
  const [result, setResult] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [showRecursive, setShowRecursive] = useState(false);
  const [showIterative, setShowIterative] = useState(false);

  const [fourPegMoves, setFourPegMoves] = useState([]);
  const [playerName4Peg, setPlayerName4Peg] = useState("");
  const [userMoveCount4Peg, setUserMoveCount4Peg] = useState("");
  const [userMoves4Peg, setUserMoves4Peg] = useState([]);
  const [isRunning4, setIsRunning4] = useState(false);
  const [isStarted4, setIsStarted4] = useState(false);
  const [timer4Peg, setTimer4Peg] = useState(0);
  const [result4Peg, setResult4Peg] = useState(null);

  const [pegs, setPegs] = useState({ A: [], B: [], C: [] });
  const [selectedDisk, setSelectedDisk] = useState(null);
  
  const [pegs4, setPegs4] = useState({ A: [], B: [], C: [], D: [] });
  const [selectedDisk4, setSelectedDisk4] = useState(null);
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds preloader
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const initialDisks = Array.from({ length: diskCount }, (_, i) => diskCount - i);
    setPegs({ A: initialDisks, B: [], C: [] });
    setUserMoves([]);
    setUserMoveCount(0);
    setSelectedDisk(null);
  }, [diskCount]);

  const handlePegClick = (pegName) => {
    const currentPeg = pegs[pegName];
    if (selectedDisk !== null) {
      const topDisk = currentPeg[currentPeg.length - 1];
      if (!topDisk || selectedDisk < topDisk) {
        const newPegs = { ...pegs };
        const sourcePeg = Object.keys(pegs).find((peg) => pegs[peg].includes(selectedDisk));
        newPegs[sourcePeg] = newPegs[sourcePeg].filter((d) => d !== selectedDisk);
        newPegs[pegName] = [...newPegs[pegName], selectedDisk];
        setPegs(newPegs);
        setUserMoves((prev) => [...prev, { disk: selectedDisk, from: sourcePeg, to: pegName }]);
        setUserMoveCount((prev) => prev + 1);
        setSelectedDisk(null);
      } else {
        alert("Invalid move! Cannot place larger disk on smaller disk.");
      }
    } else {
      if (currentPeg.length > 0) {
        const disk = currentPeg[currentPeg.length - 1];
        setSelectedDisk(disk);
      }
    }
  };

  useEffect(() => {
    const initialDisks = Array.from({ length: diskCount }, (_, i) => diskCount - i);
    setPegs4({ A: initialDisks, B: [], C: [], D: [] });
    setUserMoves4Peg([]);
    setUserMoveCount4Peg(0);
    setSelectedDisk4(null);
  }, [diskCount]);

  const handlePegClick4 = (pegName) => {
    const currentPeg = pegs4[pegName];
    if (selectedDisk4 !== null) {
      const topDisk = currentPeg[currentPeg.length - 1];
      if (!topDisk || selectedDisk4 < topDisk) {
        const newPegs4 = { ...pegs4 };
        const sourcePeg = Object.keys(pegs4).find((peg) => pegs4[peg].includes(selectedDisk4));
        newPegs4[sourcePeg] = newPegs4[sourcePeg].filter((d) => d !== selectedDisk4);
        newPegs4[pegName] = [...newPegs4[pegName], selectedDisk4];
        setPegs4(newPegs4);
        setUserMoves4Peg((prev) => [...prev, { disk: selectedDisk4, from: sourcePeg, to: pegName }]);
        setUserMoveCount4Peg((prev) => prev + 1);
        setSelectedDisk4(null);
      } else {
        alert("Invalid move! Cannot place larger disk on smaller disk.");
      }
    } else {
      if (currentPeg.length > 0) {
        const disk = currentPeg[currentPeg.length - 1];
        setSelectedDisk4(disk);
      }
    }
  };


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

  

//4-Peg Tower of Hanoi (Frame-Stewart Algorithm)

  const start4PegGame = () => {
    setResult4Peg(null);
    const moves = solveHanoi4Pegs(diskCount, "A", "B", "C", "D");
    setFourPegMoves(moves);
  };

  useEffect(() => {
    let interval4 = null;
    if (isRunning4) {
      interval4 = setInterval(() => setTimer4Peg((t) => t + 1), 1000);
    }
    return () => clearInterval(interval4);
  }, [isRunning4]);

  const handleStart4peg = () => {
    setIsStarted4(true);
    setIsRunning4(true);
    start4PegGame();
  };

  
  const reset4PegGame = () => {
  setDiskCount(getRandomDisks());
  setPlayerName4Peg("");
  setFourPegMoves([]);
  setUserMoveCount4Peg("");
  setUserMoves4Peg([]);
  setIsStarted4(false);
  setIsRunning4(false);
  setResult4Peg(null);
  setTimer4Peg(0);
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

   // Stop the 4-Peg timer
   setIsRunning4(false);  // This stops the timer

 // Format the user moves for 4-peg game
 const formattedUserMoves4Peg = userMoves4Peg.map(
  (move) => `${move.disk} Disk ${move.from.toUpperCase()}→${move.to.toUpperCase()}`
);

// Compare user moves with the correct 4-peg moves and check correctness
const is4PegCorrect =
  formattedUserMoves4Peg.length === fourPegMoves.length &&
  JSON.stringify(formattedUserMoves4Peg) === JSON.stringify(fourPegMoves);

// Set the result for 4-peg game
setResult4Peg({
  playerName: playerName4Peg,
  diskCount,
  userMoveCount: formattedUserMoves4Peg.length,
  userSequence: formattedUserMoves4Peg,
  isCorrect: is4PegCorrect,
  timeTaken: timer4Peg,
  solution: fourPegMoves,
  solutionTime: fourPegMoves.length,
});
};

if (isLoading) {
  return (
    <div className="preloader">
      <img src="/hanoi-logo.png" alt="Loading..." className="loader-image" />
      <h2>Loading Tower of Hanoi Game...</h2>
      <div className="spinner"></div>
    </div>
  );
}


  return (
    <div className="hanoi-container">
      <h2>3-Peg Tower of Hanoi Challenge </h2>
      <h3>Disks for this round: <strong>{diskCount}</strong></h3>

      <div className="visual-board">
      {Object.entries(pegs).map(([pegName, pegDisks]) => (
          <div className="peg" key={pegName} onClick={() => handlePegClick(pegName)}>
            <div className="peg-bar" />
            <div className="peg-label">{pegName}</div>
            {pegDisks.map((disk) => (
              <div
                key={disk}
                className={`disk ${selectedDisk === disk ? "selected" : ""}`}
                style={{ width: `${disk * 20 + 40}px`, backgroundColor: `hsl(${disk * 30}, 70%, 60%)` }}
              >
                {disk}
              </div>
            ))}
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
          <h3>GAME RESULT</h3>
          <p><strong>Player:</strong> {result.playerName}</p>
          <p><strong>Disks Count:</strong> {result.diskCount}</p>
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
  <h2>4-Peg Tower of Hanoi Challenge</h2>
  <h3>Disks for this round: <strong>{diskCount}</strong></h3>

  <div className="visual-board">
  {Object.entries(pegs4).map(([pegName, pegDisks]) => (
          <div className="peg" key={pegName} onClick={() => handlePegClick4(pegName)}>
            <div className="peg-bar" />
            <div className="peg-label">{pegName}</div>
            {pegDisks.map((disk) => (
              <div
                key={disk}
                className={`disk ${selectedDisk === disk ? "selected" : ""}`}
                style={{ width: `${disk * 20 + 40}px`, backgroundColor: `hsl(${disk * 30}, 70%, 60%)` }}
              >
                {disk}
              </div>
            ))}
          </div>
        ))}
</div>

  
  <button className="start-btn" onClick={handleStart4peg} disabled={isStarted4}>Start Game</button>

  {isStarted4 && (
        <form onSubmit={handle4PegSubmit} className="hanoi-form">
    
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
                min="1"
                max={diskCount}
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
              <option value="D">D</option>
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
              <option value="D">D</option>
            </select>

            </div>
          ))}
        </div>
        
        <button className="submit" type="submit" disabled={!isStarted4} > Submit Answer</button> 
        <button className="reset" onClick={reset4PegGame}>Reset 4-Peg Game</button>
        </form>
        
 )}
 <h3>⏱️ Time Elapsed: {timer4Peg}s</h3>
        {result4Peg && (
        <div className="result">
          <h3>GAME RESULT</h3>
          <p><strong>Player:</strong> {result4Peg.playerName}</p>
          <p><strong>Disk Count:</strong> {result4Peg.diskCount}</p>
          <p><strong>Your Move Count:</strong> {result4Peg.userMoveCount}</p>
          <p><strong>Your Sequence:</strong> {result4Peg.userSequence.join(", ")}</p>
          <p><strong>Correct:</strong> {result4Peg.isCorrect ? "👏🏻 Yes" : "❌ No"}</p>
          <p><strong>Time Taken:</strong> {result4Peg.timeTaken}s</p>
          <p><strong>Optimal Solution:</strong></p>
          <div className="move-list">
        {fourPegMoves.map((move, index) => (
          <div key={index}>{move}</div>
        ))}
      </div>
          <p><strong>Optimal Solution Move Count:</strong> {result4Peg.solutionTime}</p>
          <p><strong>Result:</strong> {result4Peg.isCorrect ? "🏆 You Win!" : "😞 Try Again!"}</p>
        </div>
      )}
 
</div>
 
    </div> 
  );
  
};


export default TowerOfHanoi;
