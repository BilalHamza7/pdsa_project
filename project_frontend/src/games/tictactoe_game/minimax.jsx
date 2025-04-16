export const getBestMoveMinimax = (board, player = 'O') => {
  const opponent = player === 'X' ? 'O' : 'X';

  // 1. Try to win
  const winningMove = findWinningMove(board, player);
  if (winningMove) return winningMove;

  // 2. Try to block opponent's win
  const blockingMove = findWinningMove(board, opponent);
  if (blockingMove) return blockingMove;

  // 3. Collect all possible moves (reduce perfection)
  const candidates = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (!board[i][j]) {
        // Favor middle-ish board (but not always)
        const centerBias = 2 - Math.abs(2 - i) - Math.abs(2 - j);
        candidates.push({ row: i, col: j, score: centerBias });
      }
    }
  }

  // Shuffle and sort to pick "moderate" choice
  candidates.sort((a, b) => b.score - a.score);
  const limitedChoices = candidates.slice(0, 4); // top 4 possible
  return limitedChoices[Math.floor(Math.random() * limitedChoices.length)];
};

// Check if placing a piece results in a win
function findWinningMove(board, player) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (!board[i][j]) {
        board[i][j] = player;
        const win = checkWinner(board) === player;
        board[i][j] = null;
        if (win) return { row: i, col: j };
      }
    }
  }
  return null;
}
