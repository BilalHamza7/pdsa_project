import { checkWinner } from './checkWinner';

export function getBestMoveMinimaxLite(board, player) {
  const opponent = player === 'X' ? 'O' : 'X';

  const isWinningMove = (board, row, col, player) => {
    const tempBoard = board.map(r => [...r]);
    tempBoard[row][col] = player;
    return checkWinner(tempBoard) === player;
  };

  // Try to win
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (!board[r][c] && isWinningMove(board, r, c, player)) {
        return { row: r, col: c }; // Return winning move
      }
    }
  }

  // Try to block
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (!board[r][c] && isWinningMove(board, r, c, opponent)) {
        return { row: r, col: c }; // Return blocking move
      }
    }
  }

  // Ensure there's always a fallback move (pick the first available empty spot)
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (!board[r][c]) {
        return { row: r, col: c }; // Return first available move
      }
    }
  }

  // If the board is full and no move is found, return null (game over)
  return null; 
}
