import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { PulseLoader, HashLoader } from 'react-spinners';
import axios from 'axios';

import Chessboard from './components/chessboard';
import './styles/main.css';
import findSequentialSolutions from './components/sequential';
import findThreadedSolutions from './components/threadedMain';
import GameDetails from './components/gameDetails';
import handleSubmit from './components/handleSubmit';

export default function Main() {

    const navigate = useNavigate();

    const [playerName, setPlayerName] = useState('');
    const [positions, setPositions] = useState(Array(8).fill(-1));
    const [sequentialResult, setSequentialResult] = useState({});
    const [threadedResult, setThreadedResult] = useState({});
    const [playerSolutionCount, setPlayerSolutionCount] = useState(-1);
    const [gameResult, setGameResult] = useState("Waiting");
    const [showConfetti, setShowConfetti] = useState(false);

    const [resetModal, setResetModal] = useState(false);
    const [resetSolModal, setResetSolModal] = useState(false);

    const handleBoardChange = (pos) => {
        setPositions(pos);
        console.log(pos);
    };

    const resetGame = async () => {  // clears all data and restarts the game
        try {
            const response = await axios.delete('http://localhost:5000/api/eightQueensPuzzle/clearAllData')
            if (!response.data && response.status !== 200) {
                alert("Unable to reset game, please try again.");
                return;
            }
            setResetModal((prev) => !prev);
            window.location.reload();
        } catch (error) {
            alert("An unexpected error occurred. Please check your connection or try again later.");
        }
    };

    const ResetGameModal = ({ resetModal, handleResetModal }) => {  // when player clicks reset button
        if (!resetModal) return null;

        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexDirection: 'column',
                    textAlign: 'center'
                }}
            >
                <h2>Reset Game!</h2>
                <p>This will completely erase all the solutions found by the players!<br /> <strong>Do you really want to reset the game?</strong></p>
                <div style={{ display: 'flex', gap: '24px' }}>
                    <button onClick={() => resetGame()} className='button_style' style={{ backgroundColor: "#EE4B2B" }}>
                        Reset
                    </button>
                    <button onClick={() => handleResetModal()} className='button_style' style={{ backgroundColor: "white" }}>
                        Cancel
                    </button>
                </div>
            </div >
        );
    };

    const ResetSolModal = ({ resetSolModal, handleResetSolModal }) => {  // when all 92 solutions are found
        if (!resetSolModal) return null;

        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexDirection: 'column',
                    textAlign: 'center'
                }}
            >
                <h2>Congratulations! You’ve Mastered the Eight Queens Puzzle!</h2>
                <p>Incredible work! You’ve successfully discovered <strong>all possible solutions</strong> to the puzzle. Only a true strategist can achieve this. Feel free to play again and challenge yourself to find them faster!</p>
                <div style={{ display: 'flex', gap: '24px' }}>
                    <button onClick={() => resetGame()} className='button_style' style={{ backgroundColor: "#EE4B2B" }}>
                        Reset
                    </button>
                    <button onClick={() => handleResetSolModal()} className='button_style' style={{ backgroundColor: "white" }}>
                        Wait
                    </button>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const runSolutionsAndStore = async () => {
            try {
                setPlayerSolutionCount(-1);

                const threadedResult = await findThreadedSolutions();
                const sequentialResult = await findSequentialSolutions();

                if (!sequentialResult || !threadedResult) {
                    alert("Failed to generate valid solutions. Please try again.");
                    return;
                }

                setThreadedResult(threadedResult);
                setSequentialResult(sequentialResult);

                const response = await axios.post('http://localhost:5000/api/eightQueensPuzzle/solutions', {
                    sequentialResult,
                    threadedResult,
                });
                if (response.data?.error) {
                    console.error("Server returned an error:", response.data.error);
                    alert(response.data.error);
                    return;
                }

                const plSolCountResponse = await axios.get('http://localhost:5000/api/eightQueensPuzzle/getPlayerSolutionCount');
                if (!plSolCountResponse.data && plSolCountResponse.status !== 200) {
                    alert("Unable to retrieve player solution count.");
                    return;
                }
                setPlayerSolutionCount(plSolCountResponse.data);
            } catch (error) {
                console.error("Unhandled error during solution processing:", error);
                alert("An unexpected error occurred. Please check your connection or try again later.");
            }
        }

        runSolutionsAndStore();
    }, []);

    return (
        <div className="parent_container">
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    gravity={0.3}
                    recycle={false}
                />
            )}
            <div className='puzzle_game_container'>
                <p style={{ fontSize: 'x-large', fontWeight: '600', position: 'absolute', top: '10px' }}>Eight Queen's Puzzle</p>
                <div className='puzzle_header'>
                    <ResetGameModal resetModal={resetModal} handleResetModal={() => setResetModal((prev) => !prev)} />
                    <ResetSolModal resetSolModal={resetSolModal} handleResetSolModal={() => setResetSolModal((prev) => !prev)} />
                    <button className='button_style' style={{ background: 'rgb(241, 156, 121, .5)' }} onClick={() => setResetModal((prev) => !prev)}>Reset</button>
                    <button className='button_style' style={{ background: 'rgb(164, 114, 63, .5)' }} onClick={() => window.location.reload()}>Restart</button>
                    <button className='button_style' style={{ background: 'rgb(164, 74, 63, .5)' }} onClick={() => navigate('/')}>Quit</button>
                </div>
                <p className='' style={{ width: 'fit-content', textAlign: 'center', marginTop: '20px' }} >Welcome to the Eight Queens Puzzle! Your challenge is to place eight queens on an 8x8 chessboard such that no two queens can attack each other. <br /> <span style={{ fontWeight: '600' }}>This means: No two queens can share the same row, column, or diagonal</span></p>
                <div className="puzzle_play_area">
                    <Chessboard onBoardChange={handleBoardChange} positions={positions} />
                    <div className='puzzle_game_details'>
                        <label htmlFor="playerName" style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', fontWeight: '500' }}>Enter Player Name:
                            <input type="text" id='playerName' value={playerName} placeholder='Player Name' onChange={(e) => setPlayerName(e.target.value)} style={{ outline: 'none', fontSize: 'medium', fontFamily: 'Montserrat', padding: '6px', borderRadius: '4px' }} />
                        </label>
                        <div className="" style={{ display: 'flex', gap: '48px', width: '100%', margin: '36px 0 0 0' }}>
                            <p style={{ margin: '0', fontWeight: '300' }}>Possible Number Of Solutions:<span style={{ fontWeight: '600' }}> {sequentialResult.numberOfSolutions != null ? sequentialResult.numberOfSolutions : (<span>&nbsp;&nbsp;<HashLoader size={20} /></span>)}</span></p>
                            <p style={{ margin: '0', fontWeight: '300' }}>Solutions Currently Found:<span style={{ fontWeight: '600' }}> {playerSolutionCount != -1 ? playerSolutionCount : (<span>&nbsp;&nbsp;<HashLoader size={20} /></span>)}</span></p>
                        </div>
                        <p style={{ margin: '36px 0 0 0', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Selected Positions [Row, Column]:</p>
                        <div className='positions'>
                            {positions
                                .slice()  // copy array
                                .reverse()
                                .map((col, index) => (
                                    col >= 0 && (
                                        <p key={index}>
                                            <strong>{index + 1}.</strong> [ {index + 1}, {col + 1} ]
                                        </p>
                                    )
                                ))}
                        </div>
                        <button onClick={() => handleSubmit(playerName, positions, setGameResult, sequentialResult, setShowConfetti, setResetSolModal, setPlayerSolutionCount)} className='button_style' style={{ backgroundColor: 'rgb(48, 115, 81, .5)', margin: '4px 0 0 0' }}>
                            Submit
                        </button>
                        <div className="puzzle_result_area" style={gameResult === "Win" ? { backgroundColor: 'rgb(147, 255, 150, .8)' } : gameResult === "Lose" ? { backgroundColor: 'rgb(236, 78, 32, .5)' } : gameResult === "Draw" ? { backgroundColor: 'rgb(242, 221, 110, .5)' } : { backgroundColor: 'white' }}>
                            <p style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: 'large' }}>{playerName ? `${playerName}'s Results` : "Player Results"}</p>
                            {/* Results after submission */}
                            <p style={{ textAlign: 'center', fontWeight: '500', fontFamily: 'serif', fontSize: 'larger', margin: '24px 32px 0 32px' }}>
                                {gameResult === "Waiting" && "Start placing the queens on the board and submit to find out your results!"}
                                {gameResult === "Win" && "Congratulations! You have correctly identified a solution of solving the puzzle! But wait, that is just one of many, try to find another solution if you can"}
                                {gameResult === "Draw" && "Oops! Your solution has already been recognized. Try finding another solution!"}
                                {gameResult === "Lose" && "Uh-oh! That setup doesn't place all eight queens safely. Remember — no two queens can share the same row, column, or diagonal. Keep experimenting — the perfect arrangement is out there!"}
                                {gameResult === "Loading" && (
                                    <PulseLoader />
                                )}
                            </p>
                        </div>
                        <button
                            className='button_style'
                            onClick={() => {
                                window.scrollBy({ top: 650, behavior: 'smooth' });
                            }}
                        >
                            Game Details
                        </button>
                    </div>
                </div>
            </div>

            <GameDetails sequential={sequentialResult} threaded={threadedResult} playerSolutionCount={playerSolutionCount} />
        </div >
    )
};
