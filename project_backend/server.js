require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase client with service role key
const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

app.post('/api/tictactoe', async (req, res) => {
    const round_number = 10; const player_name = "PDSA";
    const { data, error } = await supabase
        .from('tic_tac_toe')
        .insert([{ round_number, player_name }]);

    if (error) return res.status(400).json({ error });
    res.json(data);
    console.log(data);
    console.error(error);
});

app.listen(5000, () => {
    console.log('Express server running on port 5000');
});