
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

export const solveHanoi4Pegs = (n, source, auxiliary1, auxiliary2, destination) => {
  const result = [];

  const hanoi4 = (n, source, auxiliary1, auxiliary2, destination) => {
    if (n === 0) return;
    if (n === 1) {
      result.push(`1 Disk ${source} → ${destination}`);
      return;
    }

    // Choose optimal k (approximation)
    const k = n - Math.floor(Math.sqrt(2 * n + 1)) + 1;

    // Move top k disks to aux1 using all 4 pegs
    hanoi4(k, source, destination, auxiliary2, auxiliary1);

    // Move remaining n-k disks using classic 3-peg solution
    const subResult = solveHanoiRecursive(n - k, source, auxiliary2, destination);
    result.push(...subResult);

    // Move k disks from aux1 to destination
    hanoi4(k, auxiliary1, source, auxiliary2, destination);
  };

  hanoi4(n, source, auxiliary1, auxiliary2, destination);
  return result;
};