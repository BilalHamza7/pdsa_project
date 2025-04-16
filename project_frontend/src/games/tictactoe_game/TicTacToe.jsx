import React, { useState, useEffect } from 'react';
import './TicTacToe.css';

const emptyBoard = Array(5).fill(null).map(() => Array(5).fill(null));

const checkWinner = (board, player) => {
  for (let i = 0; i < 5; i++) {
    if (board[i].every(cell => cell === player)) return true;
    if (board.every(row => row[i] === player)) return true;
  }
  if (board.every((row, i) => row[i] === player)) return true;
  if (board.every((row, i) => row[4 - i] === player)) return true;
  return false;
};

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
    const best = getFirstAvailableMove(board); // Algorithm 1
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
    const winnerX = checkWinner(board, 'X');
    const winnerO = checkWinner(board, 'O');
    const draw = isDraw(board);

    if (winnerX || winnerO || draw) {
      setGameOver(true);
      setMessage(
        winnerX ? `${playerName} Wins!` : winnerO ? 'Computer Wins!' : 'Draw Game'
      );
      return;
    }

    if (!playerTurn) {
      setTimeout(() => computerMove(), 500);
    }
  }, [board, playerTurn]);

  const getFirstAvailableMove = (brd) => {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (!brd[i][j]) return { row: i, col: j };
      }
    }
    return null;
  };

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
      <h1>Tic Tac Toe 5x5</h1>

      {!nameSubmitted ? (
        <form className="name-form" onSubmit={handleNameSubmit}>
          <input
            type="text"
            className="name-input"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button type="submit" className="name-submit-btn">Start Game</button>
        </form>
      ) : (
        <>
          <div className="board">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  className="cell"
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
