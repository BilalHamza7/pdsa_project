import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TicTacToe.css';
import { computerMove, resetAlgorithmicCounter } from './computerMoveStrategy';
import { checkWinner } from './checkWinner';
import { supabase } from './supabaseClient'; // Assuming this is your Supabase client

const emptyBoard = Array(5).fill(null).map(() => Array(5).fill(null));

const TicTacToe = () => {
  const navigate = useNavigate();

  const [board, setBoard] = useState(emptyBoard);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState(null); // To store the player's ID
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [error, setError] = useState('');
  const [welcome, setWelcome] = useState('');
  const [moveTimings, setMoveTimings] = useState([]); // To store move timings
  const [gameSaved, setGameSaved] = useState(false); // To track if the game has been saved

  const makeMove = (row, col) => {
    if (board[row][col] || gameOver) return;
    const updated = board.map(r => [...r]);
    updated[row][col] = 'X';
    setBoard(updated);
    setPlayerTurn(false);
  };

  useEffect(() => {
    if (gameSaved) return;

    const winner = checkWinner(board);
    if (winner && !gameOver) {
      setGameOver(true);
      if (winner === 'X') setMessage(`${playerName} Wins!`);
      else if (winner === 'O') setMessage('Computer Wins!');
      else if (winner === 'Draw') setMessage('Draw Game');

      // Save game data to Supabase when the game ends
      saveGameData(winner);
      setGameSaved(true);
      return;
    }

    if (!playerTurn && !gameOver) {
      setTimeout(() => {
        const startTime = performance.now();
        const newBoard = computerMove(board, 'minimax', 'O');
        const endTime = performance.now();
        const minimaxTime = Math.round(endTime - startTime);

        // Store the move timing
        setMoveTimings((prev) => [
          ...prev,
          { move_number: prev.length + 1, minimax_time: minimaxTime, heuristic_time: 0 },
        ]);

        setBoard(newBoard);
        setPlayerTurn(true);
      }, 500);
    }
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

      const { data: player, error: playerError } = await supabase
        .from('tictactoeplayers')
        .select('id, game')
        .eq('id', playerId)
        .single();

      if (playerError) {
        console.error('Player fetch error:', playerError);
        throw playerError;
      }

      // Update player game result
      const { error: updateError } = await supabase
        .from('tictactoeplayers')
        .update({ game: result })
        .eq('id', playerId);

      if (updateError) {
        console.error('Game result update error:', updateError);
        throw updateError;
      }

      // Insert move timings into TicTacToeMoveTimings table
      if (moveTimings.length > 0) {
        const moveTimingsToInsert = moveTimings.map((move) => ({
          player_id: playerId,
          move_number: move.move_number,
          minimax_time: move.minimax_time,
          heuristic_time: move.heuristic_time,
        }));

        const { error: moveError } = await supabase
          .from('tictactoemovetimings')
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

  const resetGame = () => {
    setBoard(emptyBoard);
    setPlayerTurn(true);
    setGameOver(false);
    setMessage('');
    setShowMessage(true);
    setMoveTimings([]);
    setGameSaved(false);
    resetAlgorithmicCounter();
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setWelcome('');

    if (!playerName.trim()) {
      setError('Name cannot be blank. Please enter a valid name.');
      return;
    }
    if (!/^[A-Za-z]+$/.test(playerName)) {
      setError('Name can only contain letters. Please enter a valid name.');
      return;
    }

    try {
      let { data: existingPlayer, error: fetchError } = await supabase
        .from('tictactoeplayers')
        .select('id')
        .eq('name', playerName)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingPlayer) {
        setPlayerId(existingPlayer.id);
      } else {
        const { data: newPlayer, error: insertError } = await supabase
          .from('tictactoeplayers')
          .insert([{ name: playerName, game: 'Draw' }]) // Default game result as 'Draw'
          .select('id')
          .single();

        if (insertError) throw insertError;
        setPlayerId(newPlayer.id);
      }

      setNameSubmitted(true);
      resetAlgorithmicCounter();
      setWelcome(`Welcome, ${playerName}!`);
    } catch (error) {
      console.error('Error saving player:', error);
      setError('Failed to save player. Please try again.');
    }
  };

  const toggleInfoDisplay = () => setShowInfo(!showInfo);

  const closeMessage = () => {
    setShowMessage(false);
    setPlayerName('');
    setPlayerId(null);
    setNameSubmitted(false);
    setMoveTimings([]);
    setGameSaved(false);
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
