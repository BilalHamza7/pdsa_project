
export const solveHanoiRecursive = (n, source, destination, auxiliary, result = []) => { // Recursive solution for Tower of Hanoi
  const recordMove = (disk, from, to) => {
    result.push(`${disk} Disk ${from} → ${to}`);
  };

  const move = (d, from, to, aux) => {
    if (d === 1) {
      recordMove(1, from, to);
      return;
    }
    move(d - 1, from, aux, to);
    recordMove(d, from, to);
    move(d - 1, aux, to, from);
  };

  move(n, source, destination, auxiliary);
  return result;
};

// Iterative (non-recursive) solution for Tower of Hanoi
export const solveHanoiIterative = (n, source, destination, auxiliary) => {
  const result = [];
  const totalMoves = Math.pow(2, n) - 1;
  const pegs = {
    A: [],
    B: [],
    C: [],
  };

  // Initialize source peg
  for (let i = n; i >= 1; i--) {
    pegs[source].push(i);
  }

  // For even number of disks, swap destination and auxiliary
  if (n % 2 === 0) {
    [destination, auxiliary] = [auxiliary, destination];
  }

  for (let i = 1; i <= totalMoves; i++) {
    if (i % 3 === 1) {
      moveDisk(pegs, source, destination, result);
    } else if (i % 3 === 2) {
      moveDisk(pegs, source, auxiliary, result);
    } else if (i % 3 === 0) {
      moveDisk(pegs, auxiliary, destination, result);
    }
  }

  return result;
};

const moveDisk = (pegs, from, to, result) => {
  const fromTop = pegs[from][pegs[from].length - 1];
  const toTop = pegs[to][pegs[to].length - 1];

  // If from peg is empty, move from 'to' to 'from'
  if (!fromTop) {
    const disk = pegs[to].pop();
    pegs[from].push(disk);
    result.push(`${disk} Disk ${to} → ${from}`);
  }
  // If to peg is empty, move from 'from' to 'to'
  else if (!toTop) {
    const disk = pegs[from].pop();
    pegs[to].push(disk);
    result.push(`${disk} Disk ${from} → ${to}`);
  }
  // Move smaller disk on top of larger one
  else if (fromTop < toTop) {
    const disk = pegs[from].pop();
    pegs[to].push(disk);
    result.push(`${disk} Disk ${from} → ${to}`);
  } else {
    const disk = pegs[to].pop();
    pegs[from].push(disk);
    result.push(`${disk} Disk ${to} → ${from}`);
  }
};

export const solveHanoi4Pegs = (n, source, aux1, aux2, destination) => {
  // Edge case: if there are no disks
  if (n === 0) return [];

  const result = [];

  // Main 4-peg recursive function
  const hanoi4 = (num, from, to, aux1, aux2, disks) => {
    if (num === 0) return;

    if (num === 1) {
      const disk = disks[disks.length - 1];
      result.push({ disk, from, to });
      return;
    }

    // Find the optimal k for minimizing moves
    let minMoves = Infinity;
    let bestK = 1;

    for (let k = 1; k < num; k++) {
      const moves = 2 * moveCount4Peg(k) + Math.pow(2, num - k) - 1;
      if (moves < minMoves) {
        minMoves = moves;
        bestK = k;
      }
    }

    // Split the disks into top k and remaining disks
    const topKDisks = disks.slice(0, bestK); // Smallest disks
    const remainingDisks = disks.slice(bestK); // Larger disks

    // Step 1: Move k disks to aux1
    hanoi4(bestK, from, aux1, to, aux2, topKDisks);

    // Step 2: Move remaining n-k disks to destination using 3 pegs
    solveHanoiRecursiveDSA(remainingDisks.length, from, to, aux2, remainingDisks, result);

    // Step 3: Move k disks from aux1 to destination
    hanoi4(bestK, aux1, to, from, aux2, topKDisks);
  };

  // Move count with memoization
  const moveCount4Peg = (() => {
    const memo = {};
    return function count(disks) {
      if (disks <= 0) return 0;
      if (disks === 1) return 1;
      if (memo[disks]) return memo[disks];

      let min = Infinity;
      for (let k = 1; k < disks; k++) {
        const moves = 2 * count(k) + Math.pow(2, disks - k) - 1;
        if (moves < min) min = moves;
      }

      memo[disks] = min;
      return min;
    };
  })();

  // Prepare the disk list [1, 2, 3, ..., n]
  const diskList = Array.from({ length: n }, (_, i) => i + 1); 

  // Start solving
  hanoi4(n, source, destination, aux1, aux2, diskList);

  // Format output for each move
  return result.map((move, index) => `Move ${index + 1}: Disk ${move.disk} ${move.from} → ${move.to}`);
};

// Helper function for step 2 inside 4-peg: recursive 3-peg solution
const solveHanoiRecursiveDSA = (n, source, destination, auxiliary, disks, result) => {
  if (n === 1) {
    result.push({ disk: disks[disks.length - 1], from: source, to: destination });
    return;
  }

  const remainingDisks = disks.slice(0, disks.length - 1); // Top disks
  const currentDisk = disks[disks.length - 1]; // Bottom disk

  solveHanoiRecursiveDSA(n - 1, source, auxiliary, destination, remainingDisks, result);
  result.push({ disk: currentDisk, from: source, to: destination });
  solveHanoiRecursiveDSA(n - 1, auxiliary, destination, source, remainingDisks, result);
};
