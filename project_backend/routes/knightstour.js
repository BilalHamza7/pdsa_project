import express from 'express';
import { supabase} from '../server.js';

const router = express.Router();

router.post('/save-game', async (req, res) => {
    const { playerName, algorithm, moves, timeTaken } = req.body;

    if (
        playerName === undefined || algorithm === undefined || 
        moves === undefined || timeTaken === undefined
    ) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    

    try {
        const { error } = await supabase
            .from('knights_tour')
            .insert([
                {
                    player_name: playerName,
                    algorithm: algorithm,
                    moves: moves,
                    time_taken: timeTaken,
                },
            ]);

        if (error) {
            console.error('Supabase Insert Error:', error);
            return res.status(500).json({ error: 'Failed to save game result' });
        }

        res.status(200).json({ message: 'Game result saved successfully' });
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


export default router;