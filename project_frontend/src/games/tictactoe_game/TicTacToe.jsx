import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TicTacToe.css';
import { supabase } from './supabaseClient';
import { computerMove, resetAlgorithmicCounter } from './computerMoveStrategy';
import { checkWinner } from './checkWinner';

const emptyBoard = Array(5).fill(null).map(() => Array(5).fill(null));

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
  const [error, setError] = useState('');
  const [welcome, setWelcome] = useState('');
  const [playerId, setPlayerId] = useState(null);
  

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
  
      let result = '';
  
      if (winner === 'X') {
        setMessage(`${playerName} Wins!`);
        result = 'Win';
      } else if (winner === 'O') {
        setMessage('Lose!');
        result = 'Lose';
      } else if (winner === 'Draw') {
        setMessage('Draw Game');
        result = 'Draw';
      }
  
      // Update player result in database
      if (playerId) {
        (async () => {
          const { error } = await supabase
            .from('tictactoeplayers')
            .update({ game: result })
            .eq('id', playerId);
  
          if (error) {
            console.error('Failed to update game result:', error.message);
          } else {
            console.log('Player result updated:', result);
          }
        })();
      }
  
      return;
    }
  
    if (!playerTurn && !gameOver) {
      setTimeout(() => {
        const startTime = performance.now(); // Start tracking time before the move
  
        // Track time for Minimax algorithm
        const minimaxBoard = computerMove(board, 'minimax', 'O');
        const minimaxEndTime = performance.now();
        const minimaxTime = minimaxEndTime - startTime;
  
        // Track time for Heuristic algorithm
        const heuristicStartTime = performance.now();
        const heuristicBoard = computerMove(board, 'heuristic', 'O');
        const heuristicEndTime = performance.now();
        const heuristicTime = heuristicEndTime - heuristicStartTime;
  
        setBoard(minimaxBoard); // Set the board after Minimax move
        
        const roundedMinimaxTime = minimaxTime.toFixed(3); // Round to 3 decimal places
        const roundedHeuristicTime = heuristicTime.toFixed(3); // Round to 3 decimal places
        // Save the move times in the database
        if (playerId) {
          (async () => {
            const moveNumber = board.flat().filter(cell => cell !== null).length + 1; // Calculate move number
            const { error } = await supabase
              .from('tictactoemovetimings')
              .insert([
                {
                  player_id: playerId,
                  move_number: moveNumber,
                  minimax_time: minimaxTime, // Save the time for minimax move
                  heuristic_time: heuristicTime, // Save the time for heuristic move
                }
              ]);
  
            if (error) {
              console.error('Failed to save move time:', error.message);
            } else {
              console.log('Move times saved:', minimaxTime, 'Heuristic:', heuristicTime);
            }
          })();
        }
  
        setPlayerTurn(true);
      }, 500);
    }
  }, [board, playerTurn, playerId, playerName, gameOver]);
  
  
  const resetGame = () => {
    setBoard(emptyBoard);
    setPlayerTurn(true);
    setGameOver(false);
    setMessage('');
    setShowMessage(true);
    resetAlgorithmicCounter();
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setWelcome('');
  
    if (!playerName.trim()) {
      setError('Name cannot be blank. Please enter a valid name.');
    } else if (!/^[A-Za-z]+$/.test(playerName)) {
      setError('Name can only contain letters.');
    } else {
      try {
        const { data, error } = await supabase
          .from('tictactoeplayers')
          .insert([{ name: playerName, game: 'Draw' }])  // game is required!
          .select('id')
          .single(); // Get only one inserted row
  
        if (error) throw error;
  
        setPlayerId(data.id); // Save player id for later
        setNameSubmitted(true);
        resetAlgorithmicCounter();
        setWelcome(`Welcome, ${playerName}!`);
        console.log(`Player ID: ${data.id}, Name: ${playerName}`);
      } catch (err) {
        console.error('Error inserting player:', err.message);
        setError('Failed to save player.');
      }
    }
  };

  const toggleInfoDisplay = () => setShowInfo(!showInfo);

  const closeMessage = () => {
    setShowMessage(false);
    setPlayerName('');
    setNameSubmitted(false);
    resetGame();
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
          <button type="submit" className="name-submit-btn">Let's start the game!</button>
          {error && <p className="error-message">{error}</p>}
          {welcome && <p className="welcome-message">{welcome}</p>}
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
                <p>Your mission: <strong>Get 5 X’s in a row</strong> — row, column, or diagonal. 💡</p>
                <p>But beware! 🤖 The computer uses clever algorithms to outplay you!</p>
                <p><strong>Think fast, play smart — beat the bot! 🏆</strong></p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TicTacToe;