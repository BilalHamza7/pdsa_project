import React, { useState } from 'react';

import './Game.css';

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
              <div><span className="symbol x">X</span> <p>You</p></div>
              <div><span className="symbol o">O</span> <p>Computer</p></div>
            </div>
            <button className="info-btn">ℹ️ Info</button>
            <button className="restart-btn" onClick={handleRestart}>🔄 Restart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
