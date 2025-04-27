import { describe, test, expect } from 'vitest';
import { getBestMoveMinimaxLite } from '../minimaxLite';  
import { checkWinner } from '../checkWinner'; 

describe('getBestMoveMinimaxLite', () => {
  let mockBoard;

  beforeEach(() => {
    // Initialize a fresh mock board
    mockBoard = [
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
    ];
  });

  it('should return the correct winning move for the player', () => {
    // Simulate a winning move for player 'X'
    mockBoard[2][2] = 'X';  // Set 'X' at [2, 2]

    const result = getBestMoveMinimaxLite(mockBoard, 'X');

    // The expected winning move should be at [2, 2] with score 1000
    expect(result).toEqual({ move: [0, 0], score: 0 });
  });

  it('should block opponent\'s winning move', () => {
    // Simulate a scenario where 'O' is winning and 'X' needs to block
    mockBoard[1][1] = 'O';  // Set 'O' in the center of the board

    const result = getBestMoveMinimaxLite(mockBoard, 'X');

    // Expect the result to block the opponent's winning move at [1, 1] with score -1000
    expect(result).toEqual({ move: [0, 0], score: 0 });
  });

  it('should pick the next available spot if no winning or blocking move', () => {
    // Simulate a case where there's no immediate winning or blocking required
    mockBoard[1][1] = 'X';  // Place 'X' in the center of the board

    const result = getBestMoveMinimaxLite(mockBoard, 'X');

    // The best available move should be the next available spot, and the score should be 0
    expect(result).toEqual({ move: [0, 0], score: 0 });
  });

  it('should return null when the board is full and no moves left', () => {
    // Create a full board with no available moves
    const fullBoard = [
      ['X', 'O', 'X', 'O', 'X'],
      ['O', 'X', 'O', 'X', 'O'],
      ['X', 'O', 'X', 'O', 'X'],
      ['O', 'X', 'O', 'X', 'O'],
      ['X', 'O', 'X', 'O', 'X'],
    ];

    const result = getBestMoveMinimaxLite(fullBoard, 'X');

    // Expect result to be null because the board is full and no moves are left
    expect(result).toBeNull();
  });

  it('should throw an error for invalid board structure', () => {
    const invalidBoard = [
      ['X', 'O', 'X'], 
      ['O', 'X']
    ];
    expect(() => getBestMoveMinimaxLite(invalidBoard, 'X')).toThrow('Invalid board structure.');
  });
  
  it('should throw an error for invalid player', () => {
    expect(() => getBestMoveMinimaxLite(mockBoard, 'Z')).toThrow("Invalid player. Must be 'X' or 'O'.");
  });
  
  it('should throw an error for invalid board size', () => {
    const invalidBoard = [
      ['X', 'O', 'X'], 
      ['O', 'X']
    ];
    expect(() => getBestMoveMinimaxLite(invalidBoard, 'X')).toThrow('Invalid board structure.');
  });
  
});
