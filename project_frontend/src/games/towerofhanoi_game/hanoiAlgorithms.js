// Recursive solution for Tower of Hanoi
export const solveHanoiRecursive = (n, source, destination, auxiliary, result = []) => {
    if (n === 1) {
      result.push(`${source}→${destination}`);
      return result;
    }
    solveHanoiRecursive(n - 1, source, auxiliary, destination, result);
    result.push(`${source}→${destination}`);
    solveHanoiRecursive(n - 1, auxiliary, destination, source, result);
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
      pegs[from].push(pegs[to].pop());
      result.push(`${to}→${from}`);
    } else {
      pegs[to].push(pegs[from].pop());
      result.push(`${from}→${to}`);
    }
  }
  