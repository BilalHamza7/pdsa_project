import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TicTacToe.css';

import { computerMove, resetAlgorithmicCounter } from './computerMoveStrategy';
import { checkWinner } from './checkWinner';
<<<<<<< HEAD
=======
import { supabase } from './supabaseClient'; // Import Supabase client
>>>>>>> 97405f39a6ecf40446617b101f96a5f2ed6ec24f

const minimaxTime = (minimaxEnd - minimaxStart) ;
const heuristicTime = (heuristicEnd - heuristicStart) ;
const emptyBoard = Array(5).fill(null).map(() => Array(5).fill(null));

const TicTacToe = () => {
  const navigate = useNavigate();

  const [board, setBoard] = useState(emptyBoard);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
<<<<<<< HEAD
=======
  const [playerId, setPlayerId] = useState(null);
>>>>>>> 97405f39a6ecf40446617b101f96a5f2ed6ec24f
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [error, setError] = useState('');
  const [welcome, setWelcome] = useState('');
<<<<<<< HEAD
=======
  const [moveTimings, setMoveTimings] = useState([]);
  const [gameSaved, setGameSaved] = useState(false);
>>>>>>> 97405f39a6ecf40446617b101f96a5f2ed6ec24f

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
      if (winner === 'X') setMessage(`${playerName} Wins!`);
      else if (winner === 'O') setMessage('Computer Wins!');
      else if (winner === 'Draw') setMessage('Draw Game');
<<<<<<< HEAD
=======

      saveGameData(winner);
      setGameSaved(true);
>>>>>>> 97405f39a6ecf40446617b101f96a5f2ed6ec24f
      return;
    }

    if (!playerTurn && !gameOver) {
      setTimeout(() => {
<<<<<<< HEAD
        const newBoard = computerMove(board, 'minimax', 'O');
=======
        const { newBoard, minimaxTime, heuristicTime } = computerMove(board, 'both', 'O');

        setMoveTimings(prev => [
          ...prev,
          { move_number: prev.length + 1, minimax_time: minimaxTime, heuristic_time: heuristicTime }
        ]);

>>>>>>> 97405f39a6ecf40446617b101f96a5f2ed6ec24f
        setBoard(newBoard);
        setPlayerTurn(true);
      }, 500);
      
    }
<<<<<<< HEAD
  }, [board, playerTurn, playerName, gameOver]);

  const resetGame = () => {
    setBoard(emptyBoard);
    setPlayerTurn(true);
    setGameOver(false);
    setMessage('');
    setShowMessage(true);
    resetAlgorithmicCounter();
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    setError('');
    setWelcome('');
    if (!playerName.trim()) {
      setError('Name cannot be blank. Please enter a valid name.');
    } else if (!/^[A-Za-z]+$/.test(playerName)) {
      setError('Name can only contain letters. Please enter a valid name.');
    } else {
      setNameSubmitted(true);
      resetAlgorithmicCounter();
      setWelcome(`Welcome, ${playerName}!`);
=======
  }, [board, playerTurn, gameOver, playerName, gameSaved]);

  const saveGameData = async (winner) => {
    try {
      if (!playerId) {
        console.error('No player ID available.');
        return;
      }
  
      let result = '';
      if (winner === 'X') result = 'Win';
      else if (winner === 'O') result = 'Lose';
      else result = 'Draw';
  
      // Insert the game result into the database
      const { data: player, error: playerError } = await supabase
        .from('TicTacToePlayers')
        .select('id, game')
        .eq('id', playerId)
        .single();
  
      if (playerError) {
        console.error('Player fetch error:', playerError);
        throw playerError;
      }
  
      const { error: updateError } = await supabase
        .from('TicTacToePlayers')
        .update({ game: result })
        .eq('id', playerId);
  
      if (updateError) {
        console.error('Game result update error:', updateError);
        throw updateError;
      }
  
      if (moveTimings.length > 0) {
        // Insert move timings
        const moveTimingsToInsert = moveTimings.map((move) => ({
          player_id: playerId,
          move_number: move.move_number,
          minimax_time: parseFloat((move.minimax_time ).toFixed(2)),
          heuristic_time: parseFloat((move.heuristic_time ).toFixed(2)),
        }));
  
        const { error: moveError } = await supabase
          .from('TicTacToeMoveTimings')
          .insert(moveTimingsToInsert);
  
        if (moveError) {
          console.error('Move insert error:', moveError);
          throw moveError;
        }
      }
  
      console.log('Game data saved successfully');
    } catch (error) {
      console.error('Error saving game data:', error);
      setError('Failed to save game data. Please try again.');
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      const { data: player, error } = await supabase
        .from('TicTacToePlayers')
        .insert([{ name: playerName, game: 'Draw' }])
        .select('id')
        .single();

      if (error) {
        console.error('Error creating player:', error);
        setError('Failed to create player. Please try again.');
      } else {
        setPlayerId(player.id);
        setNameSubmitted(true);
        setWelcome(`Welcome, ${playerName}!`);
      }
    } else {
      setError('Please enter a valid name.');
>>>>>>> 97405f39a6ecf40446617b101f96a5f2ed6ec24f
    }
  };

  const toggleInfoDisplay = () => setShowInfo(!showInfo);

  const closeMessage = () => {
    setShowMessage(false);
    setPlayerName('');
    setNameSubmitted(false);
    resetGame();
  };

  const resetGame = () => {
    setBoard(emptyBoard);
    setGameOver(false);
    setPlayerTurn(true);
    setMessage('');
    setMoveTimings([]);
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
