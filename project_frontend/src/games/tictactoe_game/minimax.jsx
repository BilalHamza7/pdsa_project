export function getBestMoveMinimax(board, player) {
    const opponent = player === 'X' ? 'O' : 'X';
    let bestScore = -Infinity;
    let bestMove = null;
  
    function minimax(board, depth, isMaximizing) {
      const winner = checkWinner(board);
      if (winner === player) return 10 - depth;
      if (winner === opponent) return depth - 10;
      if (winner === 'Draw') return 0;
  
      if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 5; j++) {
            if (board[i][j] === '') {
              board[i][j] = player;
              const evalScore = minimax(board, depth + 1, false);
              board[i][j] = '';
              maxEval = Math.max(evalScore, maxEval);
            }
          }
        }
        return maxEval;
      } else {
        let minEval = Infinity;
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 5; j++) {
            if (board[i][j] === '') {
              board[i][j] = opponent;
              const evalScore = minimax(board, depth + 1, true);
              board[i][j] = '';
              minEval = Math.min(evalScore, minEval);
            }
          }
        }
        return minEval;
      }
    }
  
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (board[i][j] === '') {
          board[i][j] = player;
          const score = minimax(board, 0, false);
          board[i][j] = '';
          if (score > bestScore) {
            bestScore = score;
            bestMove = [i, j];
          }
        }
      }
    }
  
    return bestMove;
  }