import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Chessboard from './chessboard';
import '../styles/main.css';
import findSequentialSolutions from './sequential';
import findThreadedSolutions from './threadedMain';

export default function Main() {

    const navigate = useNavigate();
    const isWhite = true;

    const [board, setBoard] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [sequentialResult, setSequentialResult] = useState({});
    const [threadedResult, setThreadedResult] = useState({});

    const [playerPositions, setPlayerPositions] = useState([]);

    const handleBoardChange = (updatedBoard) => {
        setBoard(updatedBoard);
    };

    const handleSubmit = () => {
        const namePattern = /^[A-Za-z\s]+$/; //checks if player name matches the regex
        if (playerName.trim() === '' && !namePattern.test(playerName)) {
            alert('Please Enter A Valid Player Name!');
            return;
        }

        const positions = board.map(row => row.indexOf(true)).reverse(); // array with column indexes of queens placed
        setPlayerPositions(positions);

        // check if solution is matching a value in the solutions record in the database

        // if matching, congratulate and save player details. Increment solutions found count

        // if not matching, lose and try again

        // if already found, draw try again


        console.log(sequentialResult);
        console.log(threadedResult);
        console.log(positions);


    }


    useEffect(() => {
        const runSolutionsAndStore = async () => {

            const threadedResult = await findThreadedSolutions();
            const sequentialResult = await findSequentialSolutions();
            setThreadedResult(threadedResult);
            setSequentialResult(sequentialResult);

            console.log(sequentialResult);
            console.log(threadedResult);

            try {
                const response = await axios.post('http://localhost:5000/api/eightQueensPuzzle/solutions', {
                    sequentialResult,
                    threadedResult,
                });

                console.log('Result from API:', response.data);
            } catch (error) {
                console.error('Error in making fetch request:', error);
            }
        }

        runSolutionsAndStore();
    }, []);


    return (
        <div className="parent_container">
            <div className='puzzle_game_container'>
                <p style={{ fontSize: 'x-large', fontWeight: '600', position: 'absolute' }}>Eight Queen's Puzzle</p>
                <div className='puzzle_header'>
                    <button className='button_style' style={{ background: 'rgb(241, 156, 121, .5)' }} onClick={() => resetGame()}>Reset</button>
                    <button className='button_style' style={{ background: 'rgb(164, 74, 63, .5)' }} onClick={() => navigate('/')}>Quit</button>
                </div>
                <p className='' style={{ width: 'fit-content', textAlign: 'center', marginTop: '20px' }} >Welcome to the Eight Queens Puzzle! Your challenge is to place eight queens on an 8x8 chessboard such that no two queens can attack each other. <br /> <span style={{ fontWeight: '600' }}>This means: No two queens can share the same row, column, or diagonal</span></p>
                <div className="puzzle_play_area">
                    <Chessboard onBoardChange={handleBoardChange} />
                    <div className='puzzle_game_details'>
                        <label htmlFor="playerName" style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', fontWeight: '500' }}>Enter Player Name:
                            <input type="text" id='playerName' value={playerName} placeholder='Player Name' onChange={(e) => setPlayerName(e.target.value)} style={{ outline: 'none', fontSize: 'medium', fontFamily: 'Montserrat', padding: '6px' }} />
                        </label>
                        <div className="" style={{ display: 'flex', gap: '48px', width: '100%', margin: '36px 0 0 0' }}>
                            <p style={{ margin: '0', fontWeight: '300' }}>Possible Number Of Solutions:<span style={{ fontWeight: '600' }}> {sequentialResult.numberOfSolutions}</span></p>
                            <p style={{ margin: '0', fontWeight: '300' }}>Solutions Currently Found:<span style={{ fontWeight: '600' }}> N</span></p>
                        </div>
                        <p style={{ margin: '36px 0 0 0', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Selected Positions [Row, Column]:</p>
                        <div className='positions'>
                            {board
                                .flatMap((row, rowIndex) =>
                                    row.map((hasQueen, colIndex) =>
                                        hasQueen ? { row: 8 - rowIndex, col: colIndex + 1 } : null
                                    )
                                )
                                .filter(Boolean)
                                .map((pos, index, arr) => (
                                    <span key={index}>
                                        <span style={{ fontWeight: 'bold' }}>{index + 1}.</span> [{pos.row}, {pos.col}]
                                        {index !== arr.length - 1 && ', '}
                                    </span>
                                ))
                            }
                        </div>
                        <button onClick={() => handleSubmit()} className='button_style' style={{ backgroundColor: 'rgb(48, 115, 81, .5)', margin: '12px 0 0 0' }}>
                            Submit
                        </button>
                        {/* Green: 'rgb(147, 255, 150, .5)', Red: rgb(236, 78, 32, .5), Yellow: rgb(242, 221, 110, .5) */}
                        <div className="puzzle_result_area" style={isWhite ? { backgroundColor: 'rgb(147, 255, 150, .8)' } : { backgroundColor: 'rgb(147, 255, 150, .5)' }}>
                            <p style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: 'large' }}>{playerName ? `${playerName}'s Results` : "Player Results"}</p>

                            {/* Results after submission */}
                            <p style={{ textAlign: 'center', fontWeight: '500', fontFamily: 'serif', fontSize: 'larger', margin: '24px 32px 0 32px' }}>Congratulations! You have correctly identified a solution of solving the puzzle! But wait, that is just one of many, try to find another solution if you can!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='puzzle_game_overview'>

                <p className='' style={{ width: 'fit-content', textAlign: 'center', marginTop: '20px' }}>{threadedResult.timeTaken}</p>
                {threadedResult?.solutions && (
                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '10px' }}>
                        {threadedResult.solutions.slice(0, 5).map((sol, idx) => (
                            <pre key={idx}>#{idx + 1}: {JSON.stringify(sol)}</pre>
                        ))}
                        <p>...and {threadedResult.solutions.length - 5} more</p>
                    </div>
                )}
            </div>
        </div>
    )
};
