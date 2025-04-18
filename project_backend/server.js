// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Import the game routes
const tictactoeRoute = require('./routes/tictactoe');
app.use('/api/tictactoe', tictactoeRoute);


// TIC TAC TOE
app.post('/api/tictactoe', async (req, res) => {                 // sample
    const round_number = 10; const player_name = "PDSA";
    const { data, error } = await supabase
        .from('tic_tac_toe')
        .insert([{ round_number, player_name }]);

    if (error) return res.status(400).json({ error });
    res.json(data);
    console.log(data);
    console.error(error);
});


//Traveling Salesman Problem


//Tower of Hanoi


//Eight Queen's Puzzle
app.post('/api/eightqueenpuzzle', async (req, res) => {
    const { data, error } = await supabase
        .from('eight_queen_puzzle')
        .insert([{ player_solution: { player_name: 'Bilal', solution: [7, 6, 5, 4, 3, 2, 1, 0] } }]);

    if (error) return res.status(400).json({ error });
    const result = res.json(data);
    console.log(result);
    console.error(error);
});

app.post('/api/eightqueenpuzzle/solutions', async (req, res) => {
    const { count, solution, time_taken } = req.body();
    const { data, error } = await supabase
        .from('eight_queen_puzzle')
        .insert([{ sequential_solution_count: count, sequential_solution: solution, sequential_time_taken: time_taken }]);

    if (error) return res.status(400).json({ error });
    const result = res.json(data);
    console.log(result);
    console.error(error);
});


//Knight Tour Problem


app.listen(5000, () => {
    console.log('Express server running on port 5000');
});