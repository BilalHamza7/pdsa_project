import express from 'express';
import { supabase } from '../server.js';

const router = express.Router();

// Knight's possible moves
const knightMoves = [
    [2, 1], [1, 2], [-1, 2], [-2, 1],
    [-2, -1], [-1, -2], [1, -2], [2, -1],
];

// Backtracking function
const isSafe = (x, y, board, N) =>
    x >= 0 && y >= 0 && x < N && y < N && board[x][y] === -1;
const solveKnightTour = (x, y, movei, board, N, path) => {
    if (movei === N * N) return true;
    for (const [dx, dy] of knightMoves) {
        const nextX = x + dx;
        const nextY = y + dy;
        if (isSafe(nextX, nextY, board, N)) {
            board[nextX][nextY] = movei;
            path.push([nextX, nextY]);
            if (solveKnightTour(nextX, nextY, movei + 1, board, N, path)) {
            return true;
            } else {
            board[nextX][nextY] = -1;
            path.pop();
            }
        }
    }
    return false;
};

  // API Endpoint
router.post('/backtracking', async (req, res) => {
    const { playerName, startRow, startCol, boardSize } = req.body;
    console.log(`Backtracking request from ${playerName} at (${startRow}, ${startCol})`);
    const N = boardSize || 8;
    const board = Array.from({ length: N }, () => Array(N).fill(-1));
    const path = [];

    board[startRow][startCol] = 0;
    path.push([startRow, startCol]);

    const startTime = Date.now();
    const success = solveKnightTour(startRow, startCol, 1, board, N, path);
    const endTime = Date.now();

    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

    // Store result in Supabase
    const { data, error } = await supabase.from('knights_tour').insert([
    {
        player_name: playerName,
        algorithm: 'backtracking',
        success: success,
        start_position: `(${startRow}, ${startCol})`,
        time_taken: timeTaken,
        path: JSON.stringify(path),
        board_size: N,
    },
    ]);

    if (error) {
        return res.status(500).json({ error: 'Error saving to database', details: error });
    }

    res.status(200).json({
        success,
        timeTaken,
        path,
        message: success ? 'Tour completed successfully!' : 'No solution found from this start position.',
    });
});

export default router;