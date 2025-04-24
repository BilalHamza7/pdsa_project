import express from 'express';
import { supabase } from '../server.js';
const router = express.Router();


// Save solutions, including sequential and threaded algorithms'
router.post('/solutions', async (req, res) => {
    try {
        const { sequentialResult, threadedResult } = req.body;
        console.log(req.body);

        // Check if a solution already exists
        const { data: existingSolutions, error: checkError } = await supabase
            .from('eight_queen_puzzle')
            .select('id')
            .limit(1);

        if (checkError) {
            console.error('Error checking for existing solution:', checkError);
            return res.status(500).json(checkError);
        }

        if (existingSolutions.length > 0) {
            return res.status(200).json('Solution already exists, no insert performed');
        }

        const { data, error } = await supabase
            .from('eight_queen_puzzle')
            .insert([{
                sequential_solution_count: sequentialResult.numberOfSolutions,
                sequential_solution: sequentialResult.solutions,
                sequential_time_taken: sequentialResult.timeTaken,
                threaded_solution_count: threadedResult.numberOfSolutions,
                threaded_solution: threadedResult.solutions,
                threaded_time_taken: threadedResult.timeTaken
            }])
            .select();

        if (error) {
            console.error('Insert error:', error);
            return res.status(500).json(error);
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('Unexpected Error:', error);
        res.status(500).json(error);
    }
});


// get player solutions
router.get('/getPlayerSolutions', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('eight_queen_puzzle')
            .select('player_solution->solution')
            .not('player_solution', 'is', null)

        if (error) {
            console.error('Error fetching player solutions:', error);
            return res.status(500).json(error);
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Unexpected Error:', error);
        res.status(500).json(error);
    }
});


// get sequential solutions
router.get('/getSequentialSolutions', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('eight_queen_puzzle')
            .select('sequential_solution')
            .not('sequential_solution', 'is', null);

        if (error) {
            console.error('Error fetching sequential solutions:', error);
            return res.status(500).json(error);
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Unexpected Error:', error);
        res.status(500).json(error);
    }
});


// save player name and solution
router.post('/savePlayerData', async (req, res) => {
    try {
        const { playerName, playerPositions } = req.body;

        const { data, error } = await supabase
            .from('eight_queen_puzzle')
            .insert([{
                player_solution: { playerName, solution: playerPositions }
            }])
            .select();

        if (error) {
            console.error('Delete error:', error);
            return res.status(500).json(error);
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('Unexpected Error:', error);
        res.status(500).json(error);
    }
});


// reset all data
router.delete('/clearAllData', async (req, res) => {
    try {
        const { error } = await supabase
            .from('eight_queen_puzzle')
            .delete()
            .neq('id', 0); // ids not equal to 0

        if (error) {
            console.error('Delete error:', error);
            return res.status(500).json(error);
        }
        res.status(200).json(true);
    } catch (error) {
        console.error('Unexpected Error:', error);
        res.status(500).json(error);
    }
});


// get column count
router.get('/getPlayerSolutionCount', async (req, res) => {
    try {
        const { count, error } = await supabase
            .from('eight_queen_puzzle')
            .select('player_solution', { count: 'exact', head: true })
            .not('player_solution', 'is', null);

        if (error) return res.status(500).json(error);
        res.status(200).json(count);
    } catch (error) {
        console.error('Unexpected Error:', error);
        res.status(500).json(error);
    }
});

export default router;
