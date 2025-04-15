
import React from 'react';
import Grid from './grid';  
 
import { useGameLogic } from './gameLogic';  

export default function Main() {
  const { cells, isXNext, handleCellClick } = useGameLogic();

  return (
    <div className="game-container">
      <h1 className="game-title">Tic Tac Toe - 5x5 Grid</h1>
      <p className="turn-indicator">{isXNext ? "X's Turn" : "O's Turn"}</p>
      <Grid cells={cells} handleCellClick={handleCellClick} />
    </div>
  );
}
