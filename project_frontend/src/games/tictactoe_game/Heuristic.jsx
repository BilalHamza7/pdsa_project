export const getBestMoveHeuristic = (board, player) => {
  const opponent = player === 'X' ? 'O' : 'X';
  let moveOptions = [];

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (!board[i][j]) {
        board[i][j] = player;
        const score = evaluateBoard(board, player, opponent);
        board[i][j] = null;

        moveOptions.push({ row: i, col: j, score });
      }
    }
  }

  // Sort and choose one from top 3 scored moves
  moveOptions.sort((a, b) => b.score - a.score);
  const topChoices = moveOptions.slice(0, 3);
  return topChoices[Math.floor(Math.random() * topChoices.length)];
};

const evaluateBoard = (board, player, opponent) => {
  let score = 0;
  const lines = getAllLines(board);

  lines.forEach(line => {
    const playerCount = line.filter(cell => cell === player).length;
    const opponentCount = line.filter(cell => cell === opponent).length;

    if (playerCount > 0 && opponentCount === 0) {
      score += playerCount * 1.5; // Less aggressive
    } else if (opponentCount > 0 && playerCount === 0) {
      score -= opponentCount * 1; // Less defensive
    }
  });

  return score;
};

const getAllLines = (board) => {
  const lines = [];

  // Rows & Columns
  for (let i = 0; i < 5; i++) {
    lines.push(board[i]); // row
    lines.push(board.map(row => row[i])); // column
  }

  // Diagonals
  lines.push(board.map((row, i) => row[i]));
  lines.push(board.map((row, i) => row[4 - i]));

  return lines;
};
