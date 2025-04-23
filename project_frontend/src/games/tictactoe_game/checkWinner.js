export function checkWinner(board) {
  const size = board.length;

  // Check rows and columns
  for (let i = 0; i < size; i++) {
    if (board[i][0] && board[i].every(cell => cell === board[i][0])) {
      return board[i][0];
    }
    if (board[0][i] && board.every(row => row[i] === board[0][i])) {
      return board[0][i];
    }
  }

  // Check diagonals
  if (board[0][0] && board.every((row, i) => row[i] === board[0][0])) {
    return board[0][0];
  }
  if (board[0][size - 1] && board.every((row, i) => row[size - 1 - i] === board[0][size - 1])) {
    return board[0][size - 1];
  }

  // Check for a draw (no empty spots left)
  const isBoardFull = board.every(row => row.every(cell => cell !== null && cell !== ''));

  // If no winner and the board is full, it's a draw
  if (isBoardFull) {
    return 'Draw';
  }

  // No winner and the board is not full, so the game is still ongoing
  return null;
}
