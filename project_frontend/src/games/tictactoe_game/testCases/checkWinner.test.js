import { describe, test, expect } from 'vitest'; 
import { checkWinner } from '../checkWinner'; 


describe('checkWinner', () => {

  test('should return "X" if X wins horizontally', () => {
    const board = [
      ['X', 'X', 'X'],
      [null, 'O', null],
      [null, null, 'O']
    ];
    expect(checkWinner(board)).toBe('X');
  });

  test('should return "O" if O wins vertically', () => {
    const board = [
      ['O', null, null],
      ['O', 'X', null],
      ['O', null, 'X']
    ];
    expect(checkWinner(board)).toBe('O');
  });

  test('should return "X" if X wins diagonally', () => {
    const board = [
      ['X', null, null],
      [null, 'X', null],
      [null, null, 'X']
    ];
    expect(checkWinner(board)).toBe('X');
  });

  test('should return "O" if O wins diagonally', () => {
    const board = [
      ['O', null, null],
      [null, 'O', null],
      [null, null, 'O']
    ];
    expect(checkWinner(board)).toBe('O');
  });

  test('should return "Draw" if the board is full with no winner', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      ['O', 'X', 'O']
    ];
    expect(checkWinner(board)).toBe('Draw');
  });

  test('should return null if the game is still ongoing', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', null, 'X'],
      ['O', 'X', 'O']
    ];
    expect(checkWinner(board)).toBe(null);
  });

  test('should return null if the game is still ongoing (board with empty spaces)', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', null, null],
      ['O', 'X', 'O']
    ];
    expect(checkWinner(board)).toBe(null);
  });

});
