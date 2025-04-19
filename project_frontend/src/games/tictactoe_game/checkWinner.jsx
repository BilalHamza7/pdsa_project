
const isDraw = board => board.flat().every(cell => cell);

export function checkWinner(board) {
  // Rows
  for (let i = 0; i < 5; i++) {
    if (
      board[i][0] &&
      board[i].every(cell => cell === board[i][0])
    ) return board[i][0];
  }

  // Columns
  for (let i = 0; i < 5; i++) {
    if (
      board[0][i] &&
      board.every(row => row[i] === board[0][i])
    ) return board[0][i];
  }

  // Diagonal top-left to bottom-right
  if (
    board[0][0] &&
    board.every((row, i) => row[i] === board[0][0])
  ) return board[0][0];

  // Diagonal top-right to bottom-left
  if (
    board[0][4] &&
    board.every((row, i) => row[4 - i] === board[0][4])
  ) return board[0][4];

  // Draw
  if (board.flat().every(cell => cell)) return 'Draw';

  return null;
}
