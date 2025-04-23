import { getBestMoveHeuristicLite } from '../getBestMoveHeuristicLite';
import { checkWinner } from '../checkWinner';

describe('getBestMoveHeuristicLite', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  test('should return a winning move for the player', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', 'X', null],
      ['O', 'X', null]
    ];
    checkWinner.mockReturnValueOnce('X'); // Mock checkWinner to return 'X' for the test
    const move = getBestMoveHeuristicLite(board, 'X');
    expect(move).toEqual({ row: 2, col: 2 }); // Player 'X' should win by placing at (2, 2)
  });

  test('should return a blocking move for the opponent', () => {
    const board = [
      ['O', 'X', 'X'],
      ['O', 'X', null],
      ['X', null, null]
    ];
    checkWinner.mockReturnValueOnce('X'); // Mock checkWinner to return 'X' for the test
    const move = getBestMoveHeuristicLite(board, 'O');
    expect(move).toEqual({ row: 1, col: 2 }); // Player 'O' should block 'X' by placing at (1, 2)
  });

  test('should return the best move with highest heuristic score', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      ['X', null, 'X']
    ];
    const move = getBestMoveHeuristicLite(board, 'O');
    expect(move).toEqual({ row: 2, col: 1 }); // The center (2, 1) is usually the best heuristic move
  });

  test('should return null if the board is full and no valid move is available', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      ['X', 'O', 'X']
    ];
    const move = getBestMoveHeuristicLite(board, 'X');
    expect(move).toBeNull(); // The board is full and no moves are available
  });

  test('should randomly return one of the best moves if multiple best moves exist', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', null, 'O'],
      ['X', 'O', 'X']
    ];
    const moves = [];
    for (let i = 0; i < 10; i++) {
      moves.push(getBestMoveHeuristicLite(board, 'X'));
    }
    // Ensure that (1, 1) is one of the best moves (center)
    expect(moves.some(move => move.row === 1 && move.col === 1)).toBe(true);
  });

  test('should prioritize the center position with a higher score', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', null, 'O'],
      ['X', null, 'X']
    ];
    const move = getBestMoveHeuristicLite(board, 'X');
    expect(move).toEqual({ row: 1, col: 1 }); // The center should have a higher heuristic score
  });
});
