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
  const [showInfo, setShowInfo] = useState(false); 
  const [showMessage, setShowMessage] = useState(true); 

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
        setBoard(newBoard); 
        setPlayerTurn(true); 
      }, 500);
    }
  }, [board, playerTurn, playerName]);
  

  const resetGame = () => {
    setBoard(emptyBoard);
    setPlayerTurn(true);
    setGameOver(false);
    setMessage('');
    setShowMessage(true); 
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim() !== '') {
      setNameSubmitted(true);
    }
  };

  const toggleInfoDisplay = () => {
    setShowInfo(!showInfo);  
  };

  const closeMessage = () => {
    setShowMessage(false); 
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

          {showMessage && message && (
            <div className="message-container">
              <div className="message">
                <button className="close-btn" onClick={closeMessage}>❌</button>
                <p>{message}</p>
              </div>
            </div>
          )}

          <div className="button-group">
            <button className="quit-btn" onClick={() => navigate('/')}>Quit</button>
            <button className="restart-btn" onClick={resetGame}>Restart</button>
            <button className="info-btn" onClick={toggleInfoDisplay}>Info</button>
          </div>

          {showInfo && (
            <div className="info-container">
              <div className="info-content">
  <button className="close-info-btn" onClick={toggleInfoDisplay}>❌</button>
  <h2>🎮 Welcome to the Ultimate 5x5 Tic Tac Toe Challenge! 🧠✨</h2>

  <p>Your mission, should you choose to accept it: <strong>Get 5 X’s in a row</strong> — be it across rows, columns, or diagonals. 💡</p>

  <p>But beware! 🤖 The computer is no slouch. It uses clever algorithms to try and outsmart you. Can you think faster? Move smarter? 🕵️‍♂️💥</p>

  <p><i>Every game round is a battle of wits — make your move count!</i> ⏳</p>

  <p><strong>Score high, beat the bot, and write your name into Tic Tac Toe history! 🏆🔥</strong></p>

  <p><i>Ready? Let’s play. Let the best mind win! 🧠⚔️</i></p>
</div>

            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TicTacToe;
