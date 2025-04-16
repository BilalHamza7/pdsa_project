import React, { useState } from 'react';
import './Game.css';

function Grid({ cells, handleCellClick }) {
  return (
    <div className="grid">
      {cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`cell ${cell}`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            {cell}
          </div>
        ))
      )}
    </div>
  );
}

export default function Game() {
  const [cells, setCells] = useState(Array(5).fill(null).map(() => Array(5).fill('')));
  const [isXNext, setIsXNext] = useState(true);

  const handleCellClick = (row, col) => {
    if (cells[row][col] !== '') return;

    const updated = cells.map((r, ri) =>
      r.map((c, ci) => (ri === row && ci === col ? (isXNext ? 'X' : 'O') : c))
    );
    setCells(updated);
    setIsXNext(!isXNext);
  };

  const handleRestart = () => {
    setCells(Array(5).fill(null).map(() => Array(5).fill('')));
    setIsXNext(true);
  };

  return (
    <div className="game-container">
      <div className="game-card">
        <h2 className="game-title">Tic Tac Toe Game</h2>
        <div className="game-body">
          <Grid cells={cells} handleCellClick={handleCellClick} />
          <div className="game-info">
            <div className="players">
              <div className="player">
                <span className="symbol x">❌</span>
                <p>You</p>
              </div>
              <div className="player">
                <span className="symbol o">⭕</span>
                <p>Computer</p>
              </div>
            </div>
            <div className="buttons">
              <button className="info-btn">ℹ️ Info</button>
              <button className="restart-btn" onClick={handleRestart}>🔄 Restart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
