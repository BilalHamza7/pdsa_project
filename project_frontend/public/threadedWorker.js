onmessage = function (e) {
    const { startCol } = e.data;
    const solutions = [];
    const board = new Array(8);
    board[0] = startCol;
    solveFromRow(1, board, solutions);
    postMessage({ solutions });
};

function solveFromRow(row, board, solutions) {
    if (row === 8) {
        solutions.push([...board]);
        return;
    }
    for (let col = 0; col < 8; col++) {
        if (isSafe(board, row, col)) {
            board[row] = col;
            solveFromRow(row + 1, board, solutions);
        }
    }
}

function isSafe(board, row, col) {
    for (let i = 0; i < row; i++) {
        if (
            board[i] === col ||
            board[i] - i === col - row ||
            board[i] + i === col + row
        ) {
            return false;
        }
    }
    return true;
}