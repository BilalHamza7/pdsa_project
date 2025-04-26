import { checkWinner } from './checkWinner.js';

export function getBestMoveMinimaxLite(board, player) {

  if (player !== 'X' && player !== 'O') {
    throw new Error("Invalid player. Must be 'X' or 'O'.");
  }


  if (
    !Array.isArray(board) ||
    board.length !== 5 ||
    board.some(row => !Array.isArray(row) || row.length !== 5)
  ) {
    throw new Error("Invalid board structure.");
  }

  const opponent = player === 'X' ? 'O' : 'X';

  const isWinningMove = (board, row, col, currentPlayer) => {
    const tempBoard = board.map(r => [...r]);
    tempBoard[row][col] = currentPlayer;
    return checkWinner(tempBoard) === currentPlayer;
  };

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (!board[r][c] && isWinningMove(board, r, c, player)) {
        console.log(`Winning move for ${player} at [${r}, ${c}]`);
        return { move: [r, c], score: 1000 };
      }
    }
  }

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (!board[r][c] && isWinningMove(board, r, c, opponent)) {
        console.log(`Blocking opponent's winning move at [${r}, ${c}]`);
        return { move: [r, c], score: -1000 };
      }
    }
  }

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (!board[r][c]) {
       
        return { move: [r, c], score: 0 };
      }
    }
  }

  console.log('Board is full, no valid moves left');
  return null;
}
