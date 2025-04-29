function isSafe(board, row, col) {
    for (let i = 0; i < row; i++) {
        if (
            board[i] === col ||  // No other queen in the same column.
            board[i] - i === col - row ||  // No other queen in the same top-right to bottom-left diagonal.
            board[i] + i === col + row  // No other queen in the same top-left to bottom-right diagonal.
        ) {
            return false;
        }
    }
    return true;
}

async function solveSequentially(row = 0, board = [], solutions = []) {
    if (row === 8) {
        solutions.push([...board]); // Found a complete valid solution
        return;  // exits recursive call and moves to previous level
    }
    for (let col = 0; col < 8; col++) {  // backtracking - continues loop finding a new column for the queen
        if (isSafe(board, row, col)) {
            board[row] = col; // Place queen at this position
            solveSequentially(row + 1, board, solutions); // Recur to solve for the next row
        }
    }
}

export default async function findSequentialSolutions() {
    const start = performance.now();
    const solutions = [];
    await solveSequentially(0, [], solutions); // Start solving from row 0
    const end = performance.now();
    return {
        type: "sequential",
        timeTaken: +(end - start).toFixed(2),
        numberOfSolutions: solutions.length, // Number of solutions found
        solutions, // Array of valid solutions
    };
}