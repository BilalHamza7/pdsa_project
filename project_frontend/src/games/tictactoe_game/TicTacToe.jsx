import React, { useState, useEffect } from 'react';
import './TicTacToe.css';
import { getBestMoveMinimax } from './minimax';
import { getBestMoveHeuristic } from './Heuristic';
import { checkWinner } from './checkWinner';

const emptyBoard = Array(5).fill(null).map(() => Array(5).fill(null));
const isDraw = board => board.flat().every(cell => cell);

const TicTacToe = () => {
  const [board, setBoard] = useState(emptyBoard);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);

  const makeMove = (row, col) => {
    if (board[row][col] || gameOver) return;
    const updated = board.map(r => [...r]);
    updated[row][col] = 'X';
    setBoard(updated);
    setPlayerTurn(false);
  };

  const computerMove = () => {
    const start = performance.now();
    const best = getBestMoveHeuristic(board, 'O'); // or use getBestMoveMinimax(board, 'O')
    const end = performance.now();

    if (best) {
      const updated = board.map(r => [...r]);
      updated[best.row][best.col] = 'O';
      setBoard(updated);
    }

    console.log('Computer move time (ms):', (end - start).toFixed(2));
    setPlayerTurn(true);
  };

  useEffect(() => {
    const winner = checkWinner(board);

    if (winner) {
      setGameOver(true);
      if (winner === 'X') {
        setMessage(`${playerName} Wins!`);
      } else if (winner === 'O') {
        setMessage('Computer Wins!');
      } else if (winner === 'Draw') {
        setMessage('Draw Game');
      }
      return;
    }

    if (!playerTurn) {
      setTimeout(() => computerMove(), 500);
    }
  }, [board, playerTurn]);

  const resetGame = () => {
    setBoard(emptyBoard);
    setPlayerTurn(true);
    setGameOver(false);
    setMessage('');
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim() !== '') {
      setNameSubmitted(true);
    }
  };

  return (
    <div className="tictactoe-container">
      <h1>Tic Tac Toe</h1>

      {!nameSubmitted ? (
        <form className="name-form" onSubmit={handleNameSubmit}>
          <input
            type="text"
            className="name-input"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button type="submit" className="name-submit-btn">Let's Start Game</button>
        </form>
      ) : (
        <>
          <div className="board">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  className={`cell ${cell === 'X' ? 'cell-x' : ''} ${cell === 'O' ? 'cell-o' : ''}`}


                  onClick={() => makeMove(i, j)}
                >
                  {cell}
                </button>
              ))
            )}
          </div>

          {message && <div className="message">{message}</div>}

          <button className="restart-btn" onClick={resetGame}>Restart</button>
        </>
      )}
    </div>
  );
};

export default TicTacToe;
