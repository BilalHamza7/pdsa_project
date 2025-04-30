import { generateDistanceMatrix } from "../main";

describe('generateDistanceMatrix', () => {
  it('should generate a 10x10 matrix', () => {
    const matrix = generateDistanceMatrix();
    expect(matrix.length).toBe(10); // Check rows
    matrix.forEach(row => {
      expect(row.length).toBe(10); // Check columns
    });
  });

  it('should have diagonal elements as 0', () => {
    const matrix = generateDistanceMatrix();
    for (let i = 0; i < 10; i++) {
      expect(matrix[i][i]).toBe(0); // Diagonal elements should be 0
    }
  });

  it('should have non-diagonal elements between 50 and 100', () => {
    const matrix = generateDistanceMatrix();
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (i !== j) {
          expect(matrix[i][j]).toBeGreaterThanOrEqual(50);
          expect(matrix[i][j]).toBeLessThanOrEqual(100);
        }
      }
    }
  });
});


/*import {
  tspDijkstra,
  tspNearestNeighbor,
  tspDynamicProgramming,
} from './Main';

describe('TSP Algorithms', () => {
  const matrix = [
    [0, 50, 70],
    [50, 0, 60],
    [70, 60, 0],
  ];
  const selectedCities = [0, 1, 2];
  const start = 0;

  it('tspDijkstra should return a valid route and distance', () => {
    const result = tspDijkstra(start, selectedCities, matrix);
    expect(result.route).toEqual(expect.arrayContaining([0, 1, 2, 0])); // Check route
    expect(result.distance).toBeGreaterThan(0); // Check distance
  });

  it('tspNearestNeighbor should return a valid route and distance', () => {
    const result = tspNearestNeighbor(start, selectedCities, matrix);
    expect(result.route).toEqual(expect.arrayContaining([0, 1, 2, 0])); // Check route
    expect(result.distance).toBeGreaterThan(0); // Check distance
  });

  it('tspDynamicProgramming should return a valid route and distance', () => {
    const result = tspDynamicProgramming(start, selectedCities, matrix);
    expect(result.route).toEqual(expect.arrayContaining([0, 1, 2, 0])); // Check route
    expect(result.distance).toBeGreaterThan(0); // Check distance
  });
});*/


/*import React from 'react';
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
});*/

//npm test