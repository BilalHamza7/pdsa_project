// minimax.jsx
const getBestMoveMinimax = (board) => {
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (!board[i][j]) {
        board[i][j] = 'O';
        const score = minimax(board, 0, false, -Infinity, Infinity);
        board[i][j] = null;

        if (score > bestScore) {
          bestScore = score;
          move = { row: i, col: j };
        }
      }
    }
  }

  return move;
};

export function minimax(board, depth, isMaximizing, alpha, beta) {
  const winner = checkWinner(board);
  if (winner === 'X') return -1; // Player wins
  if (winner === 'O') return 1;  // Computer wins
  if (isDraw(board)) return 0;   // Draw

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (!board[i][j]) {
          board[i][j] = 'O';  // Computer's move
          const evaluation = minimax(board, depth + 1, false, alpha, beta);
          board[i][j] = null;  // Undo move
          maxEval = Math.max(maxEval, evaluation);
          alpha = Math.max(alpha, evaluation);

          if (beta <= alpha) break; // Beta cutoff
        }
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (!board[i][j]) {
          board[i][j] = 'X';  // Player's move
          const evaluation = minimax(board, depth + 1, true, alpha, beta);
          board[i][j] = null;  // Undo move
          minEval = Math.min(minEval, evaluation);
          beta = Math.min(beta, evaluation);
          if (beta <= alpha) break; // Alpha cutoff
        }
      }
    }
    return minEval;
  }
  
    
  



}
