import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/knighttour.css';

const KnightTourMain = () => {
    const navigate = useNavigate();

    const [playerName, setPlayerName] = useState("");
    const [algorithm, setAlgorithm] = useState("");
    const [nextColumn, setNextColumn] = useState(null);
    const [nextRow, setNextRow] = useState(null);

    const [knightPath, setKnightPath] = useState([]); 
    const [startPosition, setStartPosition] = useState(null); 
    const [loading, setLoading] = useState(false);

    const [startTime, setStartTime] = useState(null); 
    const [timeTaken, setTimeTaken] = useState(null); 


    const handleStartClick = async () => {
        if (!playerName || !algorithm) {
            alert("Please enter name and select algorithm.");
            return;
        }

        setLoading(true);

        const randomRow = Math.floor(Math.random() * 8);
        const randomCol = Math.floor(Math.random() * 8);
        const start = [randomRow, randomCol];

        setStartPosition(start);
        setKnightPath([start]); 
        setStartTime(Date.now()); 
        setTimeTaken(null); 

        setNextRow('');
        setNextColumn('');
        setLoading(false);
    };
    const saveGameResult = async (finalTimeTaken) => {
        try {
            const response = await fetch('http://localhost:5000/api/knighttour/save-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playerName,
                    algorithm,
                    moves: knightPath.length,
                    timeTaken: finalTimeTaken,
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                console.error('Failed to save game:', data.error);
                alert("Failed to save your game to the database.");
            } else {
                console.log('Game result saved:', data);
                alert("🎉 Game saved to database!");
            }
        } catch (error) {
            console.error('Error sending game data:', error);
            alert("Server error while saving game.");
        }
    };
    
    //Handle user's next move
    const handleMoveClick = () => {
        if (nextRow === null || nextColumn === null) {
            alert("Please enter next move coordinates.");
            return;
        }

        const newRow = parseInt(nextRow);
        const newCol = parseInt(nextColumn);

        if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) {
            alert("Move out of bounds.");
            return;
        }

        const lastMove = knightPath[knightPath.length - 1];
        const dx = Math.abs(newRow - lastMove[0]);
        const dy = Math.abs(newCol - lastMove[1]);

        const isValidKnightMove = (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
        const alreadyVisited = knightPath.some(([r, c]) => r === newRow && c === newCol);

        if (!isValidKnightMove) {
            alert("Invalid knight move.");
            return;
        }

        if (alreadyVisited) {
            alert("You already visited that square.");
            return;
        }

        const newPath = [...knightPath, [newRow, newCol]];
        setKnightPath(newPath);
        
        if (newPath.length === 64) {
            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);
            setTimeTaken(duration);
            alert("🎉 Congratulations! You completed the tour.");
            saveGameResult(parseFloat(duration));
        }
        setNextRow('');
        setNextColumn('');
    };
    const getWarnsdorffSuggestion = (currentRow, currentCol, visited) => {
        const knightMoves = [
            [2, 1], [1, 2], [-1, 2], [-2, 1],
            [-2, -1], [-1, -2], [1, -2], [2, -1]
        ];
        const getDegree = (row, col) => {
            return knightMoves.reduce((count, [dr, dc]) => {
                const nr = row + dr;
                const nc = col + dc;
                if (
                    nr >= 0 && nr < 8 && nc >= 0 && nc < 8 &&
                    !visited.some(([vr, vc]) => vr === nr && vc === nc)
                ) {
                    return count + 1;
                }
                return count;
            }, 0);
        };
        const possibleMoves = knightMoves.map(([dr, dc]) => {
            const nr = currentRow + dr;
            const nc = currentCol + dc;
            return { row: nr, col: nc };
        }).filter(({ row, col }) =>
            row >= 0 && row < 8 &&
            col >= 0 && col < 8 &&
            !visited.some(([vr, vc]) => vr === row && vc === col)
        );
        if (possibleMoves.length === 0) return null;
        const bestMove = possibleMoves.reduce((minMove, move) => {
            const degree = getDegree(move.row, move.col);
            return degree < minMove.degree ? { ...move, degree } : minMove;
        }, { row: -1, col: -1, degree: Infinity });
        return [bestMove.row, bestMove.col];
    };    

    return (
        <div className='knight-tour-container-main'>
            <h1>Knight's Tour Game</h1>
            <p className='knight-tour-game-description'>
                Welcome to the Knight's Tour Challenge! Your goal is to move the knight across all 64 squares of the chessboard, visiting each square exactly once using valid L-shaped knight moves (two squares in one direction, one in the other).<br /><br />
                The knight starts from a random square. Use the interface below to input your moves. Complete the tour without repeating any square.<br /><br />
                Can you solve it faster than our algorithms? Good luck!
            </p>

            <h2>Knight Tour Game Setup</h2>
            <div className="knight-tour-game-user-container">
                <div className="knight-tour-user-input">
                    <label>Player Name</label>
                    <input type='text' value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder='Enter your name' />
                </div>
                <div className="knight-tour-user-input">
                    <label>Algorithm</label>
                    <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
                        <option value=""></option>
                        <option value="backtracking">Backtracking</option>
                        <option value="warnsdorff">Warnsdorff's Rule</option>
                    </select>
                </div>
                <div className="knight-tour-user-input">
                    <button onClick={handleStartClick} disabled={loading}>
                        {loading ? 'Solving...' : 'Start Game'}
                    </button>
                </div>
                <div className="knight-tour-user-input">
                    <button onClick={() => { navigate('/') }}>Quit Game</button>
                </div>
            </div>

            <h3>Input Your Next Move</h3>
            <div className="knight-tour-game-input">
                <div className="knight-tour-user-input">
                    <label>Next Column (0-7)</label>
                    <input type='number' value={nextColumn || ''} onChange={(e) => setNextColumn(e.target.value)} />
                </div>
                <div className="knight-tour-user-input">
                    <label>Next Row (0-7)</label>
                    <input type='number' value={nextRow || ''} onChange={(e) => setNextRow(e.target.value)} />
                </div>
                <div className="knight-tour-user-input">
                    <button onClick={handleMoveClick}>Apply</button>
                </div>
            </div>
            {algorithm === "warnsdorff" && knightPath.length > 0 && (
                <div style={{ textAlign: 'center', margin: '20px', fontSize: '18px' }}>
                    Suggested Next Move (Warnsdorff): {
                        (() => {
                            const [r, c] = knightPath[knightPath.length - 1];
                            const suggestion = getWarnsdorffSuggestion(r, c, knightPath);
                            return suggestion ? `Col ${suggestion[1]}, Row ${suggestion[0]} ` : "No moves available.";
                        })()
                    }
                </div>
            )}

            <div className="knight-tour-game-board">
                <div className="knight-tour-game-board-container">
                    <div className="row-number-container">
                        <div className="row-numbers">0</div>
                        <div className="row-numbers">1</div>
                        <div className="row-numbers">2</div>
                        <div className="row-numbers">3</div>
                        <div className="row-numbers">4</div>
                        <div className="row-numbers">5</div>
                        <div className="row-numbers">6</div>
                        <div className="row-numbers">7</div>
                    </div>
                    <div className="column-and-chessboard-container">
                        <div className="column-number-container">
                            <div className="column-numbers">0</div>
                            <div className="column-numbers">1</div>
                            <div className="column-numbers">2</div>
                            <div className="column-numbers">3</div>
                            <div className="column-numbers">4</div>
                            <div className="column-numbers">5</div>
                            <div className="column-numbers">6</div>
                            <div className="column-numbers">7</div>
                        </div>
                        <div className="chessboard">
                        {Array.from({ length: 8 }).map((_, row) =>
                            Array.from({ length: 8 }).map((_, col) => {
                                const moveIndex = knightPath.findIndex(
                                    ([r, c]) => r === row && c === col
                                );
                                return (
                                    <div
                                        key={`${row}-${col}`}
                                        className={`chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`}
                                    >
                                        {moveIndex !== -1 && (
                                            <span className="move-number">{moveIndex + 1}</span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                    </div>
                    
                </div>
                <div className="knight-tour-game-result-container">
                    <h2>Game Summary</h2>
                    <p>Player Name: {playerName}</p>
                    <p>Algorithm: {algorithm}</p>
                    <p>Moves Made: {knightPath.length}</p>
                    <p>Time Taken: {timeTaken ? `${timeTaken} seconds` : "-"}</p>
                </div>
            </div>
        </div>
    );
};

export default KnightTourMain;
