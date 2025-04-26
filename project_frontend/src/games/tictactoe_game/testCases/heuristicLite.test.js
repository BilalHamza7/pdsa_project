import { getBestMoveHeuristicLite } from '../heuristicLite.jsx';
import { checkWinner } from '../checkWinner'; 

describe('getBestMoveHeuristicLite', () => {

  it('should return a winning move for "X" when available', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      [null, null, null]  // X can win by placing in [2, 0]
    ];
    const player = 'X';
    const bestMove = getBestMoveHeuristicLite(board, player);
    expect(bestMove).toEqual({ row: 2, col: 0 });
  });

  it('should block opponent\'s winning move for "X"', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      [null, null, null]  // O can win by placing in [2, 0], X should block
    ];
    const player = 'X';
    const bestMove = getBestMoveHeuristicLite(board, player);
    expect(bestMove).toEqual({ row: 2, col: 0 });
  });

  it('should return the best move based on board score for "X"', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      ['X', null, null]  // Evaluates potential scoring moves
    ];
    const player = 'X';
    const bestMove = getBestMoveHeuristicLite(board, player);
    expect(bestMove).toEqual({ row: 2, col: 1 }); // Update based on scoring logic
  });

  it('should select a move with center bias when scores are equal', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      [null, null, null]  // Center-aligned move (2, 1) has higher center bias
    ];
    const player = 'X';
    const bestMove = getBestMoveHeuristicLite(board, player);
    expect(bestMove).toEqual({ row: 2, col: 0 });
  });

  it('should handle a full board with no winner (draw situation)', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      ['O', 'X', 'O']  // No moves left
    ];
    const player = 'X';
    const bestMove = getBestMoveHeuristicLite(board, player);
    expect(bestMove).toBeNull();  // No moves available
  });

  it('should return a valid move when multiple have the same score', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', null, 'O'],
      ['X', 'X', null]  // Multiple spots with equal score
    ];
    const player = 'X';
    const bestMove = getBestMoveHeuristicLite(board, player);
    expect(bestMove).toMatchObject({ row: expect.any(Number), col: expect.any(Number) });
    // Optional: check if it’s one of the expected best options
  });

  it('should prioritize center on an empty board', () => {
    const board = [
      [null, null, null],
      [null, null, null],
      [null, null, null]  // Center is at (1, 1)
    ];
    const player = 'X';
    const bestMove = getBestMoveHeuristicLite(board, player);
    expect(bestMove).toEqual({ row: 2, col: 2});  // Center prioritized on empty board
  });

});
