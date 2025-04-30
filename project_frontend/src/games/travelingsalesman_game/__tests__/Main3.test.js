import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Main from './Main';

describe('Main Component', () => {
  it('renders the component without errors', () => {
    render(<Main />);
    expect(screen.getByText(/Traveling Salesman Problem Visualizer/i)).toBeInTheDocument();
  });

  it('allows selecting cities and submitting the form', () => {
    render(<Main />);
    const cityName = screen.getByText(/Home City:/i).nextSibling.textContent;
    const cityIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].indexOf(cityName);

    // Select a city
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Enter player name
    const playerNameInput = screen.getByPlaceholderText(/Player Name/i);
    fireEvent.change(playerNameInput, { target: { value: 'Test Player' } });
    expect(playerNameInput.value).toBe('Test Player');

    // Submit the form
    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);

    // Verify that the path input appears
    expect(screen.getByPlaceholderText(/Enter path/i)).toBeInTheDocument();
  });

  it('displays an error message for invalid input', () => {
    render(<Main />);
    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);

    // Check for error message
    expect(screen.getByText(/Player name is required/i)).toBeInTheDocument();
  });
});