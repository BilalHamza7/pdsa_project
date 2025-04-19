import express from 'express';
const router = express.Router();

import { supabase } from '../server.js';

// sample
router.post('/eightqueenpuzzle', async (req, res) => {
    const { data, error } = await supabase
        .from('eight_queen_puzzle')
        .insert([{ player_solution: { player_name: 'Bilal', solution: [7, 6, 5, 4, 3, 2, 1, 0] } }]);

    if (error) return res.status(400).json({ error });
    res.json(data);
});

// Save solutions, including sequential and threaded algorithms'
router.post('/eightqueenpuzzle/solutions', async (req, res) => {
    // const { count, solution, time_taken } = req.body;
    const { data, error } = await supabase
        .from('eight_queen_puzzle')
        .insert([{
            sequential_solution_count: 10,
            sequential_solution: [1,2,3],
            sequential_time_taken: 1.5
        }]);

    if (error) return res.status(400).json({ error });
    res.json(data);
});

export default router;
