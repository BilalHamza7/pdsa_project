export function checkWinner(board) {
    // Check rows
    for (let i = 0; i < 5; i++) {
      if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][2] === board[i][3] && board[i][3] === board[i][4] && board[i][0] !== '') {
        return board[i][0]; // Return the winner (X or O)
      }
    }
  
    // Check columns
    for (let i = 0; i < 5; i++) {
      if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[2][i] === board[3][i] && board[3][i] === board[4][i] && board[0][i] !== '') {
        return board[0][i]; // Return the winner (X or O)
      }
    }
  
    // Check diagonals
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[2][2] === board[3][3] && board[3][3] === board[4][4] && board[0][0] !== '') {
      return board[0][0]; // Return the winner (X or O)
    }
    if (board[0][4] === board[1][3] && board[1][3] === board[2][2] && board[2][2] === board[3][1] && board[3][1] === board[4][0] && board[0][4] !== '') {
      return board[0][4]; // Return the winner (X or O)
    }
  
    // Check for a draw (if all cells are filled)
    if (board.flat().every(cell => cell !== '')) {
      return 'Draw';
    }
  
    return null;  // Game is still ongoing
  }
  