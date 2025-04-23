// minimaxLite.js
import { checkWinner } from './checkWinner.js';

export function getBestMoveMinimaxLite(board, player) {
  const opponent = player === 'X' ? 'O' : 'X';

  const isWinningMove = (board, row, col, currentPlayer) => {
    const tempBoard = board.map(r => [...r]);
    tempBoard[row][col] = currentPlayer;
    return checkWinner(tempBoard) === currentPlayer;
  };

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (!board[r][c] && isWinningMove(board, r, c, player)) {
        return { move: [r, c], score: 1000 }; // Winning move for player
      }
    }
  }

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (!board[r][c] && isWinningMove(board, r, c, opponent)) {
        return { move: [r, c], score: -1000 }; // Block opponent's winning move
      }
    }
  }

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (!board[r][c]) return { move: [r, c], score: 0 }; // No winner, choose an empty spot
    }
  }

  return null; // No valid move found
}