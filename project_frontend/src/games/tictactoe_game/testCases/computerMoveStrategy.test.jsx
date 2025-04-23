import { computerMove, resetAlgorithmicCounter, algorithmicMoveCounter } from '../computerMoveStrategy';
import { getBestMoveMinimaxLite } from '../minimaxLite';
import { getBestMoveHeuristicLite } from '../heuristicLite';

jest.mock('../minimaxLite', () => ({
  getBestMoveMinimaxLite: jest.fn(),
}));

jest.mock('../heuristicLite', () => ({
  getBestMoveHeuristicLite: jest.fn(),
}));

describe('computerMove', () => {
  let mockBoard;

  beforeEach(() => {
    // Set up an empty 5x5 board for the tests
    mockBoard = Array(5).fill(null).map(() => Array(5).fill(null));
    resetAlgorithmicCounter();  // Ensure the counter is reset before each test
  });

  test('should throw error if invalid board is provided', () => {
    expect(() => computerMove([], 'minimax', 'X')).toThrow("Invalid board provided.");
    expect(() => computerMove(null, 'minimax', 'X')).toThrow("Invalid board provided.");
  });

  test('should throw error if invalid algorithm is provided', () => {
    expect(() => computerMove(mockBoard, 'invalidAlgorithm', 'X')).toThrow("Invalid algorithm choice. Use 'minimax', 'heuristic', or 'both'.");
  });

  test('should throw error if invalid player is provided', () => {
    expect(() => computerMove(mockBoard, 'minimax', 'A')).toThrow("Invalid player. Must be 'X' or 'O'.");
  });

  test('should select a valid move using the minimax algorithm', () => {
    getBestMoveMinimaxLite.mockReturnValue({ move: [2, 3] });
    getBestMoveHeuristicLite.mockReturnValue({ row: 1, col: 1 });

    const updatedBoard = computerMove(mockBoard, 'minimax', 'O');

    expect(updatedBoard[2][3]).toBe('O');
    expect(mockBoard[1][1]).toBeNull();   // Heuristic move should be ignored.
  });

  test('should select a valid move using the heuristic algorithm', () => {
    getBestMoveMinimaxLite.mockReturnValue({ move: [2, 3] });
    getBestMoveHeuristicLite.mockReturnValue({ row: 1, col: 1 });

    const updatedBoard = computerMove(mockBoard, 'heuristic', 'O');

    expect(updatedBoard[1][1]).toBe('O');
    expect(mockBoard[2][3]).toBeNull();   // Minimax move should be ignored.
  });

  test('should select a valid move using both algorithms with the same move', () => {
    getBestMoveMinimaxLite.mockReturnValue({ move: [2, 3] });
    getBestMoveHeuristicLite.mockReturnValue({ row: 2, col: 3 });

    const updatedBoard = computerMove(mockBoard, 'both', 'O');

    expect(updatedBoard[2][3]).toBe('O');
  });

  test('should select a valid move using both algorithms with different moves', () => {
    getBestMoveMinimaxLite.mockReturnValue({ move: [2, 3] });
    getBestMoveHeuristicLite.mockReturnValue({ row: 1, col: 1 });

    // Since both algorithms give different moves, it should select one
    const updatedBoard = computerMove(mockBoard, 'both', 'O');

    expect(updatedBoard[2][3] === 'O' || updatedBoard[1][1] === 'O').toBe(true);
  });

  test('should throw error when trying to make a move on an already occupied cell', () => {
    mockBoard[0][0] = 'X';   // Player already made a move at (0,0)
    getBestMoveMinimaxLite.mockReturnValue({ move: [0, 0] });

    expect(() => computerMove(mockBoard, 'minimax', 'O')).toThrow("Move position is already occupied.");
  });

  test('should apply the move to the board correctly', () => {
    getBestMoveMinimaxLite.mockReturnValue({ move: [2, 3] });

    const updatedBoard = computerMove(mockBoard, 'minimax', 'O');

    // Ensure the move was applied to the correct position
    expect(updatedBoard[2][3]).toBe('O');
  });

  test('should handle errors gracefully and not crash the app', () => {
    // Force an error in the algorithm by returning an invalid move
    getBestMoveMinimaxLite.mockImplementation(() => { throw new Error('Algorithm failed') });

    const updatedBoard = computerMove(mockBoard, 'minimax', 'O');

    expect(updatedBoard).toEqual(mockBoard); // Board should remain the same
  });

  test('should increment the algorithmic move counter', () => {
    expect(algorithmicMoveCounter).toBe(0);
    computerMove(mockBoard, 'minimax', 'O');
    expect(algorithmicMoveCounter).toBe(1);
  });

  test('should reset the algorithmic move counter before each test', () => {
    computerMove(mockBoard, 'minimax', 'X');
    expect(algorithmicMoveCounter).toBe(1);
    
    resetAlgorithmicCounter();
    expect(algorithmicMoveCounter).toBe(0);  // Counter should reset
  });

  test('should handle case when heuristic returns undefined', () => {
    getBestMoveMinimaxLite.mockReturnValue({ move: [2, 3] });
    getBestMoveHeuristicLite.mockReturnValue(undefined);

    const updatedBoard = computerMove(mockBoard, 'both', 'O');

    expect(updatedBoard[2][3]).toBe('O');  // Should still use minimax's move
  });

  test('should only apply one valid move to the board', () => {
    getBestMoveMinimaxLite.mockReturnValue({ move: [2, 3] });
    getBestMoveHeuristicLite.mockReturnValue({ row: 1, col: 1 });

    const updatedBoard = computerMove(mockBoard, 'both', 'O');

    const flatBoard = updatedBoard.flat();
    expect(flatBoard.filter(cell => cell === 'O').length).toBe(1); // Only one 'O' should be placed on the board
  });
});
