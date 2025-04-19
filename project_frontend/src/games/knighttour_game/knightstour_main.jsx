import React from 'react'
import '../knighttour_game/board.css';
import KnightTourSetup from './KnightTourSetup.jsx';
const Knightstour_main = () => {
  const handleStart = ({ playerName, algorithm, startRow, startCol, boardSize }) => {
    console.log("Starting game with settings:", {
      playerName,
      algorithm,
      startRow,
      startCol,
      boardSize,
    });

    // You can now pass this data to your algorithm functions
    // and render the board accordingly
  };
  return (
    <div className='knighttour-container-main'>
      <h1>Knight's Tour Problem</h1>
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
      <KnightTourSetup onStart={handleStart} />
    </div>
  )
}

export default Knightstour_main