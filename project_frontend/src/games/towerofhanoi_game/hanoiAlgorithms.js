// Recursive solution for Tower of Hanoi
export const solveHanoiRecursive = (n, source, destination, auxiliary, result = []) => {
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

function moveDisk(pegs, from, to, result) {
  const fromTop = pegs[from][pegs[from].length - 1];
  const toTop = pegs[to][pegs[to].length - 1];

  if (!fromTop || (toTop && toTop < fromTop)) {
    const disk = pegs[to].pop();
    pegs[from].push(disk);
    result.push(`${disk} Disk ${to} → ${from}`);
  } else {
    const disk = pegs[from].pop();
    pegs[to].push(disk);
    result.push(`${disk} Disk ${from} → ${to}`);
  }
}
