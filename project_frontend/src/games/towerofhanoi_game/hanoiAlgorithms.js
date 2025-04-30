// Recursive solution for solving the Tower of Hanoi puzzle
export const solveHanoiRecursive = (n, source, destination, auxiliary, result = []) => { 

  // Helper function to record each move in a readable format
  const recordMove = (disk, from, to) => {
    result.push(`${disk} Disk ${from} → ${to}`);
  };

   // Recursive function to move 'd' disks from one peg to another
  const move = (d, from, to, aux) => {

     // Base case: if there's only one disk, move it directly
    if (d === 1) {
      recordMove(1, from, to); // Move disk 1 from source to destination
      return;
    }
     // Step 1: Move top d-1 disks from 'from' to 'auxiliary' peg
    move(d - 1, from, aux, to);
     // Step 2: Move the largest disk (disk d) from 'from' to 'to'
    recordMove(d, from, to);
    // Step 3: Move the d-1 disks from 'auxiliary' to 'to' peg
    move(d - 1, aux, to, from);
  };

   // Start the recursive process with the given number of disks
  move(n, source, destination, auxiliary);
   // Return the list of all recorded moves
  return result;
};



// Iterative (non-recursive) solution for the 3-peg Tower of Hanoi
export const solveHanoiIterative = (n, source, destination, auxiliary) => {
  const result = [];    // To store the sequence of moves
  const totalMoves = Math.pow(2, n) - 1;  // Total required moves for n disks
  const pegs = {
    A: [],
    B: [],
    C: [],
  };  // Initialize pegs as stacks

  // Fill the source peg with disks in descending order (largest at bottom)
  for (let i = n; i >= 1; i--) {
    pegs[source].push(i);
  }

  // If the number of disks is even, swap destination and auxiliary
  // This is needed to maintain correct move sequence in the iterative method
  if (n % 2 === 0) {
    [destination, auxiliary] = [auxiliary, destination];
  }

  // Perform totalMoves number of moves using modular pattern
  for (let i = 1; i <= totalMoves; i++) {
    if (i % 3 === 1) {
      moveDisk(pegs, source, destination, result); // Move between source and destination
    } else if (i % 3 === 2) {
      moveDisk(pegs, source, auxiliary, result); // Move between source and auxiliary
    } else if (i % 3 === 0) {
      moveDisk(pegs, auxiliary, destination, result);  // Move between auxiliary and destination
    }
  }

  return result;
};

// Helper function to move the top disk between two pegs
const moveDisk = (pegs, from, to, result) => {
  const fromTop = pegs[from][pegs[from].length - 1];  // Top disk from source peg
  const toTop = pegs[to][pegs[to].length - 1];     // Top disk from target peg

   // If source peg is empty, move from target to source
  if (!fromTop) {
    const disk = pegs[to].pop();
    pegs[from].push(disk);
    result.push(`${disk} Disk ${to} → ${from}`);
  }
  // If target peg is empty, move from source to target
  else if (!toTop) {
    const disk = pegs[from].pop();
    pegs[to].push(disk);
    result.push(`${disk} Disk ${from} → ${to}`);
  }
   // Move smaller disk onto larger one
  else if (fromTop < toTop) {
    const disk = pegs[from].pop();
    pegs[to].push(disk);
    result.push(`${disk} Disk ${from} → ${to}`);
  } 
   // Otherwise move from target to source
  else {
    const disk = pegs[to].pop();
    pegs[from].push(disk);
    result.push(`${disk} Disk ${to} → ${from}`);
  }
};

// Frame-Stewart algorithm for solving the 4-peg Tower of Hanoi

export const solveHanoi4Pegs = (n, source, aux1, aux2, destination) => {

  if (n === 0) return []; // No disks = no moves

  const result = []; // To store the move sequence

   // Main recursive function for 4-peg solution
  const hanoi4 = (num, from, to, aux1, aux2, disks) => {
    if (num === 0) return;

    if (num === 1) {
      const disk = disks[disks.length - 1]; // Get smallest disk
      result.push({ disk, from, to });       // Move it directly
      return;
    }

     // Try different k values to find the one with fewest total moves
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
    const memo = {};  // Store previously computed results
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

  // Step 1: Move top n-1 disks to auxiliary peg
  solveHanoiRecursiveDSA(n - 1, source, auxiliary, destination, remainingDisks, result);
   // Step 2: Move largest disk to destination
  result.push({ disk: currentDisk, from: source, to: destination });
  // Step 3: Move n-1 disks from auxiliary to destination
  solveHanoiRecursiveDSA(n - 1, auxiliary, destination, source, remainingDisks, result);
};
