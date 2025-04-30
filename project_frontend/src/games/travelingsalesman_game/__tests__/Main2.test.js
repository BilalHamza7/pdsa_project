import {
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
});
