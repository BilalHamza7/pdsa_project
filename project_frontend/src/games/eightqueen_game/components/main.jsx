import Chessboard from './chessboard';
import '../styles/main.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Main() {

    const navigate = useNavigate();
    const isWhite = true;

    const [board, setBoard] = useState([]);
    const [playerName, setPlayerName] = useState('');

    const handleBoardChange = (updatedBoard) => {
        setBoard(updatedBoard);
    };

    const handleSubmit = () => {
        if (playerName == '') {
            alert('Please Enter Player Name Before Submitting your Answer.');
            return;
        }
    }

    return (
        <div className='parent_container'>
            <p style={{ fontSize: 'x-large', fontWeight: '600', position: 'absolute' }}>Eight Queen's Puzzle</p>
            <div className='header'>
                <button className='button_style' style={{ background: 'rgb(241, 156, 121, .5)' }} onClick={() => resetGame()}>Reset</button>
                <button className='button_style' style={{ background: 'rgb(164, 74, 63, .5)' }} onClick={() => navigate('/')}>Quit</button>
            </div>
            <p className='' style={{ width: 'fit-content', textAlign: 'center', marginTop: '20px' }} >Welcome to the Eight Queens Puzzle! Your challenge is to place eight queens on an 8x8 chessboard such that no two queens can attack each other. <br /> <span style={{ fontWeight: '600' }}>This means: No two queens can share the same row, column, or diagonal</span></p>
            <div className="play_area">
                <Chessboard onBoardChange={handleBoardChange} />
                <div className='game_details'>
                    <label htmlFor="playerName" style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', fontWeight: '500' }}>Enter Player Name:
                        <input type="text" id='playerName' value={playerName} placeholder='Player Name' onChange={(e) => setPlayerName(e.target.value)} style={{ outline: 'none', fontSize: 'medium', fontFamily: 'Montserrat', padding: '6px' }} />
                    </label>
                    <div className="" style={{ display: 'flex', gap: '48px', width: '100%', margin: '36px 0 0 0' }}>
                        <p style={{ margin: '0', fontWeight: '300' }}>Highest Possible Solutions: N</p>
                        <p style={{ margin: '0', fontWeight: '300' }}>Solutions Currently Recognized: N</p>
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
                            ))}
                    </div>
                    <button onClick={() => handleSubmit()} className='button_style' style={{ backgroundColor: 'rgb(48, 115, 81, .5)', margin: '12px 0 0 0' }}>
                        Submit
                    </button>
                    {/* Green: 'rgb(147, 255, 150, .5)', Red: rgb(236, 78, 32, .5), Yellow: rgb(242, 221, 110, .5) */}
                    <div className="result_area" style={isWhite ? { backgroundColor: 'rgb(147, 255, 150, .8)' } : { backgroundColor: 'rgb(147, 255, 150, .5)' }}>
                        <p style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: 'large' }}>{playerName ? `${playerName}'s Results` : "Player Results"}</p>
                        
                        {/* Results after submission */}
                        <p style={{ textAlign: 'center', fontWeight: '500', fontFamily: 'serif', fontSize: 'larger', margin: '24px 32px 0 32px' }}>Congratulations! You have correctly identified a solution of solving the puzzle! But wait, that is just one of many, try to find another solution if you can!</p>
                    </div>
                </div>
            </div>
        </div>
    )
};
