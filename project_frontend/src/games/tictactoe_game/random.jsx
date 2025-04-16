export function getBestMoveRandom(board) {
    const available = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (board[i][j] === '') available.push([i, j]);
      }
    }
    const rand = Math.floor(Math.random() * available.length);
    return available[rand];
  }