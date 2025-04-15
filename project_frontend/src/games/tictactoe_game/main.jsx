import React from 'react';
import Grid from './grid';
import { useGameLogic } from './gameLogic';


export default function Main() {
  const { cells, isXNext, handleCellClick, restartGame } = useGameLogic();

  return (
    <div className="game-container">
      <div className="game-card">
        <h1 className="game-title">Tic Tac Toe - 5x5 Grid</h1>
        <p className="turn-indicator">
          <span className={isXNext ? 'x-turn' : 'o-turn'}>
            {isXNext ? "X's Turn" : "O's Turn"}
          </span>
        </p>
        <Grid cells={cells} handleCellClick={handleCellClick} />

        <div className="controls">
          <button className="restart-btn" onClick={restartGame}>🔄 Restart</button>
        </div>
      </div>
    </div>
  );
}
