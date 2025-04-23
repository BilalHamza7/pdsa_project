import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TicTacToe from '../TicTacToe';

// ✅ Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// ✅ Mock computerMoveStrategy
const mockComputerMove = jest.fn();
jest.mock('../computerMoveStrategy', () => ({
  computerMove: () => mockComputerMove(),
  resetAlgorithmicCounter: jest.fn(),
}));

// ✅ Mock checkWinner
const mockCheckWinner = jest.fn();
jest.mock('../checkWinner', () => ({
  checkWinner: () => mockCheckWinner(),
}));

describe('TicTacToe Component', () => {
  beforeEach(() => {
    // Reset mocks between tests
    mockComputerMove.mockReset();
    mockCheckWinner.mockReset();
  });

  test('renders the Tic Tac Toe title', () => {
    render(<TicTacToe />);
    expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  });

  test('should allow the player to enter their name', async () => {
    render(<TicTacToe />);
    const nameInput = screen.getByPlaceholderText(/Enter your name/i);
    const submitButton = screen.getByText(/Let’s start the game!/i);

    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Welcome, John!/i)).toBeInTheDocument();
  });

  test('should not allow invalid name submission', async () => {
    render(<TicTacToe />);
    const nameInput = screen.getByPlaceholderText(/Enter your name/i);
    const submitButton = screen.getByText(/Let’s start the game!/i);

    fireEvent.change(nameInput, { target: { value: 'John123' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Name can only contain letters./i)).toBeInTheDocument();
  });

  test('player can make a move', async () => {
    render(<TicTacToe />);
    const nameInput = screen.getByPlaceholderText(/Enter your name/i);
    const submitButton = screen.getByText(/Let’s start the game!/i);
    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.click(submitButton);

    const cell = await screen.findAllByRole('button');
    fireEvent.click(cell[0]);

    expect(cell[0]).toHaveTextContent('X');
  });

  test('computer makes a move after player', async () => {
    render(<TicTacToe />);
    const nameInput = screen.getByPlaceholderText(/Enter your name/i);
    const submitButton = screen.getByText(/Let’s start the game!/i);
    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.click(submitButton);

    mockComputerMove.mockReturnValueOnce([
      ['X', null, null, null, null],
      [null, 'O', null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
    ]);

    const cell = await screen.findAllByRole('button');
    fireEvent.click(cell[0]);

    await act(async () => {}); // allow state updates to process

    expect(cell[6]).toHaveTextContent('O'); // Index may vary based on your rendering logic
  });

  test('game ends when a player wins', async () => {
    mockCheckWinner.mockReturnValueOnce('X');

    render(<TicTacToe />);
    const nameInput = screen.getByPlaceholderText(/Enter your name/i);
    const submitButton = screen.getByText(/Let’s start the game!/i);
    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.click(submitButton);

    const cells = await screen.findAllByRole('button');
    fireEvent.click(cells[0]);
    fireEvent.click(cells[1]);
    fireEvent.click(cells[2]);

    expect(await screen.findByText(/Wins!/i)).toBeInTheDocument();
  });

  test('should reset the game when clicking on restart button', async () => {
    render(<TicTacToe />);
    const nameInput = screen.getByPlaceholderText(/Enter your name/i);
    const submitButton = screen.getByText(/Let’s start the game!/i);
    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.click(submitButton);

    const restartButton = await screen.findByText(/Restart/i);
    fireEvent.click(restartButton);

    const cells = screen.getAllByRole('button');
    cells.forEach(cell => {
      expect(cell).toHaveTextContent('');
    });
  });

  test('should show game info when clicking on info button', () => {
    render(<TicTacToe />);
    const infoButton = screen.getByText(/Info/i);
    fireEvent.click(infoButton);

    expect(screen.getByText(/Ultimate 5x5 Tic Tac Toe Challenge/i)).toBeInTheDocument();
  });

  test('should close game info when clicking on close info button', () => {
    render(<TicTacToe />);
    const infoButton = screen.getByText(/Info/i);
    fireEvent.click(infoButton);

    const closeInfoButton = screen.getByText(/❌/i);
    fireEvent.click(closeInfoButton);

    expect(screen.queryByText(/Ultimate 5x5 Tic Tac Toe Challenge/i)).toBeNull();
  });
});
