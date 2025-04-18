import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TicTacToe.css';
// Import logical algorithm functions
import { getBestMoveMinimaxLite } from './minimaxLite';
import { getBestMoveHeuristicLite } from './heuristicLite';

// Import the computer's move strategy handler (with randomness)
import { computerMove } from './computerMoveStrategy';

// Import the winner/draw check function
import { checkWinner } from './checkWinner';

const emptyBoard = Array(5).fill(null).map(() => Array(5).fill(null));
const isDraw = board => board.flat().every(cell => cell);

const TicTacToe = () => {
  const navigate = useNavigate();

  const [board, setBoard] = useState(emptyBoard);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);  // To toggle information display

  const makeMove = (row, col) => {
    if (board[row][col] || gameOver) return;
    const updated = board.map(r => [...r]);
    updated[row][col] = 'X';
    setBoard(updated);
    setPlayerTurn(false);
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
      setTimeout(() => {
        // Pass the algorithm and the player ('O') to computerMove
        const newBoard = computerMove(board, 'minimax', 'O');
        setBoard(newBoard); // Update the board after computer's move
        setPlayerTurn(true); // Switch back to player's turn
      }, 500);
    }
  }, [board, playerTurn, playerName]);
  

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

  const toggleInfoDisplay = () => {
    setShowInfo(!showInfo);  // Toggle the information display
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
          <button type="submit" className="name-submit-btn"> Let's start the game!</button>
        </form>
      ) : (
        <>
        
          <div className="board">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  className={`cell ${cell === 'X' ? 'cell-x' : cell === 'O' ? 'cell-o' : ''}`}
                  onClick={() => makeMove(i, j)}
                >
                  {cell}
                </button>
              ))
            )}
          </div>

          {message && <div className="message">{message}</div>}

          <div className="button-group">
            <button className="quit-btn" onClick={() => navigate('/')}>Quit</button>
            <button className="restart-btn" onClick={resetGame}>Restart</button>
            <button className="info-btn" onClick={toggleInfoDisplay}>Info</button>
          </div>

          {showInfo && (
        <div className="info-container">
  <div className="info-content">
    <button className="close-info-btn" onClick={toggleInfoDisplay}>❌</button>
    <h2>🎮 Tic Tac Toe Game 🎮</h2>
    <p><strong>Welcome to the Tic Tac Toe game! 🎉</strong></p>
    <p><i>Get ready to challenge yourself and have fun! 😎</i></p>
    <p>The goal of the game is to get <strong>three of your marks</strong> (either X or O) in a row, column, or diagonal. 🏆</p>
    <p>The computer will make its move automatically based on an algorithm. 🤖</p>
    <p><strong>Keep playing, strategize well, and claim victory! 💪</strong></p>
    <p><i>Every move counts. Best of luck! 🍀</i></p>
  </div>
</div>

          )}
        </>
      )}
    </div>
  );
};

export default TicTacToe;
