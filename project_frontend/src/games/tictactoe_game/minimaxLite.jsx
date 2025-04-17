// minimaxLite.js
import { checkWinner } from './checkWinner';
export function getBestMoveMinimaxLite(board, player) {
    const opponent = player === 'X' ? 'O' : 'X';
  
    const isWinningMove = (board, row, col, player) => {
      const tempBoard = board.map(r => [...r]);
      tempBoard[row][col] = player;
      return checkWinner(tempBoard) === player;
    };
  
    // Try to win
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (!board[r][c] && isWinningMove(board, r, c, player)) {
          console.log("Minimax Lite found winning move:", { row: r, col: c });
          return { row: r, col: c };
        }
      }
    }
  
    // Try to block
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (!board[r][c] && isWinningMove(board, r, c, opponent)) {
          console.log("Minimax Lite found blocking move:", { row: r, col: c });
          return { row: r, col: c };
        }
      }
    }
  
    // Random move fallback
    const availableMoves = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (!board[r][c]) {
          availableMoves.push({ row: r, col: c });
        }
      }
    }
  
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    console.log("Minimax Lite fallback to random move:", randomMove);
    return randomMove;
  }
  