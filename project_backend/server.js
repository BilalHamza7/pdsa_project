// server.js
import express from 'express';
import cors from 'cors';
import env from 'dotenv';
import { createClient } from '@supabase/supabase-js';

import eightQueenRoutes from './routes/eightqueenspuzzle.js';
import knightstourRoutes from './routes/knightstour.js';
const app = express();
env.config();

app.use(cors());
app.use(express.json());

export const supabase = createClient('https://utnftazcykytpjmjomzi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0bmZ0YXpjeWt5dHBqbWpvbXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NzUwMzMsImV4cCI6MjA2MDA1MTAzM30.Bgnnd6tmnGwIiBEtdfuinkSvpbZxBycIZIX0Z69iSK0')

if(!supabase) {
    console.log('Supabase client not initialized properly. Check your credentials and network connection.');
}else {
    console.log('Supabase client initialized successfully.');
};

// Import the game routes
app.use('/api/eightQueensPuzzle', eightQueenRoutes);   // Eight Queens Puzzle Games routes
app.use('/api/knightsTour', knightstourRoutes);




app.listen(5000, () => {
    console.log('Express server running on port 5000');
});