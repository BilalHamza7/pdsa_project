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
    const { thrTimeTaken, thrCount, thrSolutions, seqTimeTaken, seqCount, seqSolutions } = req.body;

    console.log("sequential: " + thrTimeTaken);
    console.log("threaded: " + thrSolutions);


    // Directly use the destructured values in the insert query
    const { data, error } = await supabase
        .from('eight_queen_puzzle')
        .insert([{
            sequential_solution_count: seqCount,
            sequential_solution: seqSolutions,
            sequential_time_taken: seqTimeTaken,
            threaded_solution_count: thrCount,
            threaded_solution: thrSolutions,
            threaded_time_taken: thrTimeTaken
        }]);

    if (error) return res.status(400).json({ error });
    res.json(data);
});

export default router;
