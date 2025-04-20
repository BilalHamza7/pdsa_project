export function getBestMoveHeuristicLite(board, player) {
  const opponent = player === 'X' ? 'O' : 'X';

  const scoreBoard = Array(5).fill(0).map(() => Array(5).fill(0));
  const directions = [
    { dr: 0, dc: 1 },  // Row
    { dr: 1, dc: 0 },  // Column
    { dr: 1, dc: 1 },  // Diagonal TL-BR
    { dr: 1, dc: -1 }, // Diagonal TR-BL
  ];

  const scoreLine = (line, player) => {
    const count = line.filter(cell => cell === player).length;
    const opponentCount = line.filter(cell => cell === opponent).length;
    if (count > 0 && opponentCount === 0) {
      return count * count;
    }
    return 0;
  };

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (!board[r][c]) {
        directions.forEach(({ dr, dc }) => {
          const line = [];
          for (let i = -2; i <= 2; i++) {
            const nr = r + dr * i;
            const nc = c + dc * i;
            if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
              line.push(board[nr][nc]);
            }
          }
          scoreBoard[r][c] += scoreLine(line, player);
        });
      }
    }
  }

  let maxScore = -1;
  let bestMoves = [];

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (!board[r][c]) {
        if (scoreBoard[r][c] > maxScore) {
          maxScore = scoreBoard[r][c];
          bestMoves = [{ row: r, col: c }];
        } else if (scoreBoard[r][c] === maxScore) {
          bestMoves.push({ row: r, col: c });
        }
      }
    }
  }

  return bestMoves.length > 0 ? bestMoves[0] : null;
}
