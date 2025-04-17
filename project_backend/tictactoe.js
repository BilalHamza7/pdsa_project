//tictactoe.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// POST endpoint to save game data
router.post('/', async (req, res) => {
    const {
        player_name,
        round_number,
        correct_response,
        algorithm,
        move_time_ms
    } = req.body;

    try {
        const { data, error } = await supabase
            .from('tic_tac_toe')
            .insert([{
                player_name,
                round_number,
                correct_response,
                algorithm,
                move_time_ms
            }])
            .select();

        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error('Error saving game data:', err);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
