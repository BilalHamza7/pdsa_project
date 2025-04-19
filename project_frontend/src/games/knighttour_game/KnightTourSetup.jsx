import React, { useState } from "react";

const KnightTourSetup = ({ onStart }) => {
  const [playerName, setPlayerName] = useState("");
  const [algorithm, setAlgorithm] = useState("backtracking");
  const [startRow, setStartRow] = useState(0);
  const [startCol, setStartCol] = useState(0);
  const [boardSize, setBoardSize] = useState(8); // optional if you're sticking to 8x8

  const handleStartClick = () => {
    if (playerName.trim() === "") {
      alert("Please enter your name.");
      return;
    }

    onStart({
      playerName,
      algorithm,
      startRow: parseInt(startRow),
      startCol: parseInt(startCol),
      boardSize: parseInt(boardSize),
    });
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Knight’s Tour Setup</h2>

      <div>
        <label>Player Name:</label><br />
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label>Algorithm:</label><br />
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
          <option value="backtracking">Backtracking</option>
          <option value="warnsdorff">Warnsdorff’s Rule</option>
        </select>
      </div>

      <div>
        <label>Start Row (0 - {boardSize - 1}):</label><br />
        <input
          type="number"
          min="0"
          max={boardSize - 1}
          value={startRow}
          onChange={(e) => setStartRow(e.target.value)}
        />
      </div>

      <div>
        <label>Start Column (0 - {boardSize - 1}):</label><br />
        <input
          type="number"
          min="0"
          max={boardSize - 1}
          value={startCol}
          onChange={(e) => setStartCol(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleStartClick}>Start Game</button>
      </div>
    </div>
  );
};

export default KnightTourSetup;
