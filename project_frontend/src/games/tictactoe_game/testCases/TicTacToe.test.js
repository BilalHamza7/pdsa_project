import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TicTacToe from '../TicTacToe';
import '@testing-library/jest-dom';

describe('TicTacToe Component', () => {
  beforeEach(() => {
    render(<TicTacToe />);
  });

  it('renders the Tic Tac Toe board correctly', () => {
    // Ensure the board has 25 cells (5x5 grid)
    const cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(25); 
  });

  it('allows the player to make a move', () => {
    const firstMove = screen.getByText('');
    fireEvent.click(firstMove);

    // After the move, the cell should contain 'X'
    expect(firstMove).toHaveTextContent('X');
  });

  it('prevents a move in an occupied cell', () => {
    const firstMove = screen.getByText('');
    fireEvent.click(firstMove);
    expect(firstMove).toHaveTextContent('X'); // First move

    // Try clicking the same cell again (should not work)
    fireEvent.click(firstMove);
    expect(firstMove).toHaveTextContent('X'); // No change
  });

  it('ends the game when a player wins', async () => {
    // Simulate a series of moves that results in a win
    fireEvent.click(screen.getByText(''));
    fireEvent.click(screen.getByText(''));
    fireEvent.click(screen.getByText(''));
    fireEvent.click(screen.getByText(''));
    fireEvent.click(screen.getByText(''));

    // Check if winning message is displayed
    const message = await screen.findByText(/Wins!/);
    expect(message).toBeInTheDocument();
  });

  it('ends the game with a draw when the board is full', async () => {
    const cells = screen.getAllByRole('button');

    // Fill the board with alternating moves
    cells.forEach((cell, index) => {
      fireEvent.click(cell);
    });

    // Check for draw message after the board is full
    const drawMessage = await screen.findByText('Draw Game');
    expect(drawMessage).toBeInTheDocument();
  });

  it('can restart the game', () => {
    const restartButton = screen.getByText('Restart');
    fireEvent.click(restartButton);

    // Check if the board has been reset (no text in any cell)
    const cells = screen.getAllByRole('button');
    cells.forEach(cell => {
      expect(cell).toHaveTextContent('');
    });
  });
});
