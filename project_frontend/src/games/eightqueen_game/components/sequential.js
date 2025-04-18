function isSafe(board, row, col) {
    for (let i = 0; i < row; i++) {
        if (
            board[i] === col ||                          // Same column
            board[i] - i === col - row ||                // Left diagonal
            board[i] + i === col + row                   // Right diagonal
        ) {
            return false;
        }
    }
    return true;
}

function solveSequentially(row = 0, board = [], solutions = []) {
    if (row === 8) {
        solutions.push([...board]); // Found a valid solution
        return;
    }
    for (let col = 0; col < 8; col++) {
        if (isSafe(board, row, col)) {
            board[row] = col; // Place queen at this position
            solveSequentially(row + 1, board, solutions); // Recur to solve for the next row
        }
    }
}

export default function findSequentialSolutions() {
    const start = performance.now();
    const solutions = [];
    solveSequentially(0, [], solutions); // Start solving from row 0
    const end = performance.now();
    return {
        type: "sequential",
        timeTaken: end - start,
        numberOfSolutions: solutions.length, // Number of solutions found
        solutions, // Array of valid solutions
    };  
}

// Run the algorithm and log results
const result = findSequentialSolutions();
console.log(`Found ${result.numberOfSolutions} solutions.`);
console.log("Time taken:", result.timeTaken, "ms");
