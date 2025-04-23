import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Confetti from 'react-confetti';
import { PulseLoader } from 'react-spinners';
import Confetti from 'react-confetti';
import { PulseLoader, HashLoader } from 'react-spinners';

import axios from 'axios';

import Chessboard from './components/chessboard';
import './styles/main.css';
import findSequentialSolutions from './components/sequential';
import findThreadedSolutions from './components/threadedMain';
import GameDetails from './components/gameDetails';

export default function Main() {

    const navigate = useNavigate();

    const [board, setBoard] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [positions, setPositions] = useState(Array(8).fill(-1));
    const [sequentialResult, setSequentialResult] = useState({});
    const [threadedResult, setThreadedResult] = useState({});
    const [playerSolutionCount, setPlayerSolutionCount] = useState(-1);
    const [gameResult, setGameResult] = useState("Waiting");
    const [showConfetti, setShowConfetti] = useState(false);

    const [resetModal, setResetModal] = useState(false);
    const [resetSolModal, setResetSolModal] = useState(false);

    const handleBoardChange = (updatedBoard, pos) => {
        setBoard(updatedBoard);
        setPositions(pos);
        // console.log(board);
        console.log(pos);
    };

    const resetGame = async () => {
        try {
            const response = await axios.delete('http://localhost:5000/api/eightQueensPuzzle/clearAllData')
            if (response) {
                setResetModal((prev) => !prev);
                location.reload();
            }
        } catch (error) {
            console.log(error)
        }
    };

    const ResetGameModal = ({ resetModal, handleResetModal }) => {
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

    const ResetSolModal = ({ resetSolModal, handleResetSolModal }) => {
        if (!resetSolModal) return null;

        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.8)',
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

    const throwConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000); // remove after 5 sec
    };

    const savePlayerData = async (playerPositions) => {
        setPlayerSolutionCount(-1);
        setGameResult("Win");
        throwConfetti();
        try {
            const response = await axios.post('http://localhost:5000/api/eightQueensPuzzle/savePlayerData', {
                playerName,
                playerPositions,
            });

            const plSolCount = await axios.get('http://localhost:5000/api/eightQueensPuzzle/getPlayerSolutionCount');
            setPlayerSolutionCount(plSolCount.data);

            if (plSolCount === sequentialResult.numberOfSolutions) {
                setResetSolModal(true);
            }

            console.log('Result from API:', response.data);
        } catch (error) {
            console.error('Error in making fetch request:', error);
        }
    };

    const handleSubmit = async () => {
        const namePattern = /^[A-Za-z\s]+$/; //checks if player name matches the regex
        if (playerName.trim() === '' && !namePattern.test(playerName)) {
            alert('Please Enter A Valid Player Name!');
            return;
        }

        setGameResult("Loading");
        const finalPos = positions.slice().reverse();
        console.log("final" + finalPos);
        console.log("pos" + positions);

        try {
            const sequentialSolutions = await axios.get('http://localhost:5000/api/eightQueensPuzzle/getSequentialSolutions');
            const playerSolutions = await axios.get('http://localhost:5000/api/eightQueensPuzzle/getPlayerSolutions');
            // console.log(sequentialSolutions, playerSolutions.data);

            // check if solution is matching a value in the solutions record in the database
            const seqArr = sequentialSolutions.data[0].sequential_solution;
            const playerData = playerSolutions.data;

            const playerArr = playerData != null && playerData.map(item => item.solution);  // map the solutions to an array

            const algoExists = seqArr.some(
                solution => JSON.stringify(solution) === JSON.stringify(finalPos)  // check if current solution exists in the stored algorithm solutions
            );

            const playerExists = playerArr == null ? false : playerArr.some(
                solution => JSON.stringify(solution) === JSON.stringify(finalPos)  // check if current solution does not exists in the stored player solutions
            );

            if (algoExists === false) setGameResult("Lose");
            else if (algoExists === true && playerExists === false) savePlayerData(finalPos);
            else if (algoExists === true && playerExists === true) setGameResult("Draw");
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        const runSolutionsAndStore = async () => {
            setPlayerSolutionCount(-1);
            const threadedResult = await findThreadedSolutions();
            const sequentialResult = await findSequentialSolutions();
            setThreadedResult(threadedResult);
            setSequentialResult(sequentialResult);

            try {
                const response = await axios.post('http://localhost:5000/api/eightQueensPuzzle/solutions', {
                    sequentialResult,
                    threadedResult,
                });

                const plSolCount = await axios.get('http://localhost:5000/api/eightQueensPuzzle/getPlayerSolutionCount');
                setPlayerSolutionCount(plSolCount.data);
            } catch (error) {
                console.error('Error in making fetch request:', error);
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
                    <button className='button_style' style={{ background: 'rgb(164, 114, 63, .5)' }} onClick={() => location.reload()}>Restart</button>
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
                        <button onClick={() => handleSubmit()} className='button_style' style={{ backgroundColor: 'rgb(48, 115, 81, .5)', margin: '4px 0 0 0' }}>
                            Submit
                        </button>
                        <div className="puzzle_result_area" style={gameResult === "Win" ? { backgroundColor: 'rgb(147, 255, 150, .8)' } : gameResult === "Lose" ? { backgroundColor: 'rgb(236, 78, 32, .5)' } : gameResult === "Draw" ? { backgroundColor: 'rgb(242, 221, 110, .5)' } : { backgroundColor: 'white' }}>
                            <p style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: 'large' }}>{playerName ? `${playerName}'s Results` : "Player Results"}</p>
                            {/* Results after submission */}
                            <p style={{ textAlign: 'center', fontWeight: '500', fontFamily: 'serif', fontSize: 'larger', margin: '24px 32px 0 32px' }}>
                                {gameResult === "Waiting" && "Start placing the queens on the board and submit to find out your results!"}
                                {gameResult === "Win" && "Congratulations! You have correctly identified a solution of solving the puzzle! But wait, that is just one of many, try to find another solution if you can"}
                                {gameResult === "Draw" && "Oops! Your solution has already been recognized by another player. Try finding another solution!"}
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
