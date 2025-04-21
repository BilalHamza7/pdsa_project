import express from 'express';
const router = express.Router();


import { supabase } from '../server.js';

// sample
router.post('/', async (req, res) => {
    const { data, error } = await supabase
        .from('eight_queen_puzzle')
        .insert([{ player_solution: { player_name: 'Bilal', solution: [7, 6, 5, 4, 3, 2, 1, 0] } }]);

    if (error) return res.status(400).json({ error });
    res.json(data);
});

// Save solutions, including sequential and threaded algorithms'
router.post('/solutions', async (req, res) => {
    const { sequentialResult, threadedResult } = req.body;
    console.log(req.body);

    const { data, error } = await supabase
        .from('eight_queen_puzzle')
        .insert([{
            sequential_solution_count: sequentialResult.numberOfSolutions,
            sequential_solution: sequentialResult.solutions,
            sequential_time_taken: sequentialResult.timeTaken,
            threaded_solution_count: threadedResult.numberOfSolutions,
            threaded_solution: threadedResult.solutions,
            threaded_time_taken: threadedResult.timeTaken
        }]);

    if (error) return res.status(400).json({ error });
    res.json(data);
});

export default router;
