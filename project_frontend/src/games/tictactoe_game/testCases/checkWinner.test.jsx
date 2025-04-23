const { checkWinner } = require('../checkWinner');

describe('checkWinner', () => {
  test('X wins horizontally', () => {
    const board = [
      ['X', 'X', 'X', 'X', 'X'],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
    ];
    expect(checkWinner(board)).toBe('X');
  });

  test('O wins vertically', () => {
    const board = [
      ['O', '', '', '', ''],
      ['O', '', '', '', ''],
      ['O', '', '', '', ''],
      ['O', '', '', '', ''],
      ['O', '', '', '', ''],
    ];
    expect(checkWinner(board)).toBe('O');
  });

  test('X wins diagonally from top-left to bottom-right', () => {
    const board = [
      ['X', '', '', '', ''],
      ['', 'X', '', '', ''],
      ['', '', 'X', '', ''],
      ['', '', '', 'X', ''],
      ['', '', '', '', 'X'],
    ];
    expect(checkWinner(board)).toBe('X');
  });

  test('O wins diagonally from top-right to bottom-left', () => {
    const board = [
      ['', '', '', '', 'O'],
      ['', '', '', 'O', ''],
      ['', '', 'O', '', ''],
      ['', 'O', '', '', ''],
      ['O', '', '', '', ''],
    ];
    expect(checkWinner(board)).toBe('O');
  });

  test('Draw game', () => {
  const board = Array(5).fill(null).map(() => Array(5).fill('X'));
  expect(checkWinner(board)).toBe('Draw'); // No winner, the game is a draw
});


  describe('checkWinner', () => {
  test('Game still ongoing', () => {
    const board = [
      ['X', 'O', 'X', 'O', ''],
      ['X', 'O', 'X', 'O', ''],
      ['X', 'O', 'X', 'O', ''],
      ['X', 'O', 'X', 'O', ''],
      ['', '', '', '', ''],
    ];
    const result = checkWinner(board);
    expect(result).toBe(null); // The game is still ongoing
  });

  test('Game is a draw', () => {
    const board = [
      ['X', 'O', 'X', 'X', 'O'],
      ['O', 'X', 'O', 'X', 'X'],
      ['X', 'X', 'O', 'O', 'X'],
      ['O', 'X', 'X', 'O', 'O'],
      ['O', 'X', 'X', 'O', 'X'],
    ];
    const result = checkWinner(board);
    expect(result).toBe('Draw'); // No winner, the game is a draw
  });
});

});
