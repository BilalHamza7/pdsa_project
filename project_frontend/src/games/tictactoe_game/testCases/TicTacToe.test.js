import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, expect } from 'vitest';
import TicTacToe from '../TicTacToe'; // Make sure this path is correct
import '@testing-library/jest-dom';

describe('TicTacToe Component', () => {
  beforeEach(() => {
    render(<TicTacToe />);
  });

  it('renders the TicTacToe component without crashing', () => {
    const button = screen.getByText('Click me'); // Replace with actual text or button in your component
    expect(button).toBeInTheDocument();
  });

  it('renders the Tic Tac Toe board correctly', () => {
    const cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(25); // 5x5 grid
  });

  it('allows the player to make a move', () => {
    const firstMove = screen.getAllByText('')[0]; // first empty cell
    userEvent.click(firstMove); // Use userEvent for a more realistic interaction
    expect(firstMove).toHaveTextContent('X');
  });

  it('prevents a move in an occupied cell', () => {
    const firstMove = screen.getAllByText('')[0];
    userEvent.click(firstMove);
    expect(firstMove).toHaveTextContent('X');

    // Try clicking again
    userEvent.click(firstMove);
    expect(firstMove).toHaveTextContent('X');
  });

  it('ends the game when a player wins', async () => {
    const cells = screen.getAllByRole('button');

    // Simulate 5 moves in a row for player X (example: first row)
    for (let i = 0; i < 5; i++) {
      userEvent.click(cells[i]); // Use userEvent for realistic clicks
    }

    const message = await screen.findByText(/Wins!/);
    expect(message).toBeInTheDocument();
  });

  it('ends the game with a draw when the board is full', async () => {
    const cells = screen.getAllByRole('button');

    // Click all cells one by one
    cells.forEach(cell => {
      userEvent.click(cell); // Use userEvent for realistic clicks
    });

    const drawMessage = await screen.findByText('Draw Game');
    expect(drawMessage).toBeInTheDocument();
  });

  it('can restart the game', () => {
    const restartButton = screen.getByText('Restart');
    userEvent.click(restartButton); // Use userEvent for the restart action

    const cells = screen.getAllByRole('button');
    cells.forEach(cell => {
      expect(cell).toHaveTextContent('');
    });
  });
});
