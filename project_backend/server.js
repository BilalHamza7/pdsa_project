// server.js
import express from 'express';
import cors from 'cors';
import env from 'dotenv';
import tictactoeRoute from './routes/tictactoe.js';
const app = express();
env.config();

app.use(cors());
app.use(express.json());


// Import the game routes
app.use('/api/tictactoe', tictactoeRoute);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
