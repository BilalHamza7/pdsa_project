import React, { useState } from 'react'
import './styles/knighttour.css';
import KnightTourSetup from './components/KnightTourSetup.jsx';
import ChessBoard from './components/ChessBoard.jsx';
import { useNavigate } from 'react-router-dom';

const Knightstour_main = () => {
  const navigate = useNavigate();

  const [tourData, setTourData] = useState(null);

  const handleStart = async ({ playerName, algorithm, startRow, startCol, boardSize }) => {
    console.log("Starting game with settings:", {
      playerName,
      algorithm,
      startRow,
      startCol,
      boardSize,
    });
  
    try {
      const response = await fetch(`http://localhost:5000/api/knightsTour/backtracking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, startRow, startCol, boardSize }),
      });
  
      console.log("Raw response object:", response);
  
      // Check raw body (even if it's not JSON)
      const rawText = await response.text();
      console.log("Raw response text:", rawText);
  
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        alert("Backend returned invalid JSON.");
        return;
      }
  
      console.log("Setting tourData:", data);
      setTourData(data); // 🧠 this is the key line!
  
    } catch (error) {
      console.error('Error:', error);
      alert('Error starting game. Please try again.');
    }
  };  
  return (
    <div className='knighttour-container-main'>
      <div className="title-container">
        <h1>Knight's Tour Problem</h1>
        <button onClick={()=> navigate('/')}>Go Back</button>
      </div>
      
      <p>
        <strong>Knight’s Tour – Game Instructions:</strong><br /><br />
        <strong>Objective:</strong> Move the knight across the entire chessboard so that it visits <em>every square exactly once</em>, using only legal L-shaped knight moves from chess.<br /><br />
        <strong>How to Play:</strong><br />
        1. The knight starts from a <em>random square</em> on the board.<br />
        2. Choose an algorithm: <strong>Backtracking</strong> (brute force) or <strong>Warnsdorff’s Rule</strong> (heuristic).<br />
        3. Click <em>"Start"</em> to begin the game.<br />
        4. Watch the knight move step-by-step across the board.<br />
        5. The goal is to fill all 64 squares with <em>unique move numbers (1 to 64)</em>.<br /><br />
        <strong>Rules:</strong> The knight can only move in an L-shape (2 squares in one direction, then 1 square perpendicular). Each square may be visited <em>only once</em>.
      </p>
      <div className="knighttour-container-secondary">
        <KnightTourSetup onStart={handleStart} />
        <ChessBoard tourData={tourData} />
      </div>
      
    </div>
  )
}

export default Knightstour_main