import express from 'express';
import { supabase } from '../server.js';
const router = express.Router();

// POST: Save a player's name and get their ID
router.post('/savePlayer', async (req, res) => {
    try {
        const { h_name } = req.body;
        const { data, error } = await supabase
            .from('tower_of_hanoi_players')
            .insert([{ h_name, created_at: new Date() }])
            .select();

        if (error) return res.status(500).json(error);
        res.status(200).json(data[0]); // Return the inserted player row
    } catch (error) {
        res.status(500).json(error);
    }
});

// POST: Save game session (meta info)
router.post('/saveGame', async (req, res) => {
    try {
        const { player_id, game_type, disk_count, user_move_count, is_correct, time_taken_seconds } = req.body;
        const { data, error } = await supabase
            .from('tower_of_hanoi_games')
            .insert([{
                player_id,
                game_type,
                disk_count,
                user_move_count,
                is_correct,
                time_taken_seconds
            }])
            .select();

        if (error) return res.status(500).json(error);
        res.status(200).json(data[0]); // Return inserted game
    } catch (error) {
        res.status(500).json(error);
    }
});

// POST: Save algorithm result for a game
router.post('/saveAlgorithmResult', async (req, res) => {
    try {
        const { game_id, algorithm_type, move_count, al_time_taken } = req.body;
        const { data, error } = await supabase
            .from('hanoi_algorithm_results')
            .insert([{ game_id, algorithm_type, move_count, al_time_taken }])
            .select();

        if (error) return res.status(500).json(error);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
});

// POST: Save user's move sequence for a game
router.post('/saveUserMoves', async (req, res) => {
    try {
        const { game_id, moves } = req.body; // moves: array of { move_order, disk_number, from_peg, to_peg }

        const formattedMoves = moves.map(move => ({
            game_id,
            move_order: move.move_order,
            disk_number: move.disk_number,
            from_peg: move.from_peg,
            to_peg: move.to_peg
        }));

        const { data, error } = await supabase
            .from('hanoi_user_moves')
            .insert(formattedMoves)
            .select();

        if (error) return res.status(500).json(error);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET: Get all player names (for testing/leaderboard)
router.get('/players', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('tower_of_hanoi_players')
            .select('*');

        if (error) return res.status(500).json(error);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
});



export default router;


