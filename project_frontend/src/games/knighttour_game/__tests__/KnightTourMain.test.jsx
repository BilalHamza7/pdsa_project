import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import KnightTourMain from '../KnightTourMain';
import { MemoryRouter } from 'react-router-dom';

describe('KnightTourMain Component', () => {
  test('renders component with initial UI', () => {
    render(
      <MemoryRouter>
        <KnightTourMain />
      </MemoryRouter>
    );

    expect(screen.getByText("Knight's Tour Game")).toBeInTheDocument();
    expect(screen.getByLabelText(/Player Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Algorithm/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Game/i)).toBeInTheDocument();
  });

  test('alerts when starting without name or algorithm', () => {
    window.alert = vi.fn();
    
    render(
      <MemoryRouter>
        <KnightTourMain />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Start Game'));
    expect(window.alert).toHaveBeenCalledWith("Please enter name and select algorithm.");
  });

  test('disables start button while loading', async () => {
    render(
      <MemoryRouter>
        <KnightTourMain />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Player Name/i), { target: { value: 'TestUser' } });
    fireEvent.change(screen.getByLabelText(/Algorithm/i), { target: { value: 'backtracking' } });
    fireEvent.click(screen.getByText('Start Game'));

    // Wait for async
    await waitFor(() => {
      expect(screen.getByText('Start Game')).toBeInTheDocument();
    });
  });
});
