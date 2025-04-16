//heuristic.jsx

export const getBestMoveHeuristic = (board, player) => {
  const opponent = player === 'X' ? 'O' : 'X';
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (!board[i][j]) {
        board[i][j] = player;
        const score = evaluateBoard(board, player, opponent);
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
const evaluateBoard = (board, player, opponent) => {
  let score = 0;

  const lines = getAllLines(board);

  lines.forEach(line => {
    const playerCount = line.filter(cell => cell === player).length;
    const opponentCount = line.filter(cell => cell === opponent).length;

    if (playerCount > 0 && opponentCount === 0) {
      // Less aggressive boost
      score += playerCount * 2;
    } else if (opponentCount > 0 && playerCount === 0) {
      // Less defensive penalty
      score -= opponentCount * 1.5;
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
