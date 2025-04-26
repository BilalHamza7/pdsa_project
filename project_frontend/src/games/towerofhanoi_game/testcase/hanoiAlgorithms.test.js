import {
    solveHanoiRecursive,
    solveHanoiIterative,
    solveHanoi4Pegs
  } from '../hanoiAlgorithms';
  
  describe('solveHanoiRecursive', () => {
    it('should solve Tower of Hanoi for 3 disks recursively', () => {
      const result = solveHanoiRecursive(3, 'A', 'C', 'B');
      expect(result).toEqual([
        '1 Disk A → C',
        '2 Disk A → B',
        '1 Disk C → B',
        '3 Disk A → C',
        '1 Disk B → A',
        '2 Disk B → C',
        '1 Disk A → C'
      ]);
    });
  });
  
  describe('solveHanoiIterative', () => {
    it('should solve Tower of Hanoi for 3 disks iteratively', () => {
      const result = solveHanoiIterative(3, 'A', 'C', 'B');
      expect(result).toEqual([
        '1 Disk A → C',
        '2 Disk A → B',
        '1 Disk C → B',
        '3 Disk A → C',
        '1 Disk B → A',
        '2 Disk B → C',
        '1 Disk A → C'
      ]);
    });
  });
  
  it('should solve Tower of Hanoi with 4 pegs for 3 disks', () => {
    const result = solveHanoi4Pegs(3, 'A', 'B', 'C', 'D');
    
    // Check that Disk 3 eventually ends up on D
    const disk3Move = result.find(move => move.includes('Disk 3') && move.includes('→ D'));
    expect(disk3Move).toBeTruthy(); // disk3 should have been moved to D
  
    // Check total number of moves is reasonable
    expect(result.length).toBeGreaterThanOrEqual(5);
    expect(result.length).toBeLessThanOrEqual(7); // for 3 disks, at most 7 moves
  });
  