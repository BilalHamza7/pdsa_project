import React from 'react';
import '../styles/chessboard.css';

const ChessBoard = () => {
    const boardSize = 8;

    const renderSquare = (row, col) => {
        const isEven = (row + col) % 2 === 0;
        const squareColor = isEven ? 'light' : 'dark';

        return (
        <div key={`${row}-${col}`} className={`square ${squareColor}`}>
            {/* Will display move number here */}
        </div>
        );
    };

return (
    <div className="knighttour-chessboard-layout">
        <div className="knighttour-chessboard-wrapper">
            <div className="chessboard">
            {[...Array(boardSize)].map((_, row) =>
                [...Array(boardSize)].map((_, col) => renderSquare(row, col))
            )}
            </div>

            {/* <div className="chessboard-details">
            <h3>Tour Details</h3>
            <p><strong>Player:</strong> [Name]</p>
            <p><strong>Algorithm:</strong> [Algorithm]</p>
            <p><strong>Starting Position:</strong> [Row, Col]</p>
            <p><strong>Current Move:</strong> [Move #]</p>
            </div> */}
            <div className="knighttour-result-panel">
                <h3>Game Summary</h3>
                <p><strong>Player:</strong> [Name]</p>
                <p><strong>Algorithm:</strong> [Algorithm]</p>
                <p><strong>Time Taken:</strong> [00:00]</p>
                <p><strong>Starting Position:</strong> [Row, Col]</p>
                <p><strong>Steps/Path:</strong></p>
                <ul className="result-steps">
                {/* Example placeholder path */}
                <li>(0, 0)</li>
                <li>(2, 1)</li>
                <li>(4, 2)</li>
                {/* ... */}
                </ul>
                <p className="result-status success"><strong>Result:</strong> Success ✅</p>
                {/* For failure, use: <p className="result-status failure">... */}
            </div>
        </div>
    </div>
  );
};

export default ChessBoard;
