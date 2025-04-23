import { getBestMoveMinimaxLite } from '../getBestMoveMinimaxLite';
import * as winnerChecker from '../checkWinner';

jest.mock('../checkWinner', () => ({
  checkWinner: jest.fn()
}));

describe('getBestMoveMinimaxLite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns a winning move for X', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', 'X', null],
      ['O', 'X', null]
    ];

    winnerChecker.checkWinner.mockImplementation(board => {
      return board[2][2] === 'X' ? 'X' : null;
    });

    const move = getBestMoveMinimaxLite(board, 'X');
    expect(move).toEqual({ row: 2, col: 2 });
  });

  test('returns a blocking move for O', () => {
    const board = [
      ['O', 'X', 'X'],
      ['O', 'X', null],
      ['X', null, null]
    ];

    winnerChecker.checkWinner.mockImplementation(board => {
      return board[1][2] === 'O' ? 'O' : (board[1][2] === 'X' ? 'X' : null);
    });

    const move = getBestMoveMinimaxLite(board, 'O');
    expect(move).toEqual({ row: 1, col: 2 });
  });

  test('returns first available spot when no win/block', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      ['X', null, 'X']
    ];

    winnerChecker.checkWinner.mockReturnValue(null);

    const move = getBestMoveMinimaxLite(board, 'O');
    expect(move).toEqual({ row: 2, col: 1 });
  });

  test('returns null if board is full', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      ['X', 'O', 'X']
    ];

    winnerChecker.checkWinner.mockReturnValue(null);

    const move = getBestMoveMinimaxLite(board, 'X');
    expect(move).toBeNull();
  });

  test('returns winning move at center', () => {
    const board = [
      ['X', 'O', 'X'],
      ['X', null, 'O'],
      ['O', 'X', 'O']
    ];

    winnerChecker.checkWinner.mockImplementation(board => {
      return board[1][1] === 'X' ? 'X' : null;
    });

    const move = getBestMoveMinimaxLite(board, 'X');
    expect(move).toEqual({ row: 1, col: 1 });
  });
});
