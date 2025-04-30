import { useNavigate } from 'react-router-dom';
import './home.css';
import tictactoeImg from '../assets/tictactoe.jpg';
import travelingsalesmanImg from '../assets/travelingsalesman.png';
import towerofhanoiImg from '../assets/towerofhanoi.jpeg';
import eightqueensImg from '../assets/eightqueens.jpeg';
import knightstourImg from '../assets/knightstour.jpeg';

export default function Home() {

    const navigate = useNavigate();

    return (
        <div className='game_container'>
            <p id='title'>Games of Algorithms</p>
            <div className='games_list'>
                <div className='game' onClick={() => navigate('/ticTacToeGame')}>
                    <img className="game_image" src={tictactoeImg} alt="Tic Tac Toe Game" />
                    <div className='game_detail'>
                        <p className='game_name'>Tic Tac Toe</p>
                        <p className='game_desc'>Challenge yourself in this 5x5 Tic Tac Toe game where you play against a smart computer opponent. Align 5 of your marks in a row — horizontally, vertically, or diagonally — to win! </p>
                        <p style={{ fontWeight: '400', color: 'red' }}>Click to Play &rarr;</p>
                    </div>
                </div>
                <div className='game' onClick={() => navigate('/travelingSalesmanGame')}>
                    <img className="game_image" src={travelingsalesmanImg} alt="Traveling Salesman Game" />
                    <div className='game_detail'>
                        <p className='game_name'>Traveling Salesman Problem</p>
                        <p className='game_desc'>Solve the classic optimization puzzle by finding the shortest possible route that visits each city exactly once and returns to the starting point. </p>
                        <p style={{ fontWeight: '400', color: 'red' }}>Click to Play &rarr;</p>
                    </div>
                </div>
                <div className='game' onClick={() => navigate('/towerOfHanoiGame')}>
                    <img className="game_image" src={towerofhanoiImg} alt="Tower of Hanoi Game" />
                    <div className='game_detail'>
                        <p className='game_name'>Tower of Hanoi</p>
                        <p className='game_desc'>Test your logic and strategy skills by moving all disks from the source rod to the destination rod, following the classic rules of this timeless puzzle. </p>
                        <p style={{ fontWeight: '400', color: 'red' }}>Click to Play &rarr;</p>
                    </div>
                </div>
                <div className='game' onClick={() => navigate('/eightQueensGame')}>
                    <img className="game_image" src={eightqueensImg} alt="Eight Queen's Game" />
                    <div className='game_detail'>
                        <p className='game_name'>Eight Queen's Puzzle</p>
                        <p className='game_desc'>Place eight queens on a chessboard so that no two queens threaten each other. Tackle this famous chess puzzle with clever moves and careful planning. </p>
                        <p style={{ fontWeight: '400', color: 'red' }}>Click to Play &rarr;</p>
                    </div>
                </div>
                <div className='game' onClick={() => navigate('/knightsTourGame')}>
                    <img className="game_image" src={knightstourImg} alt="Knight's Tour Game" />
                    <div className='game_detail'>
                        <p className='game_name'>Knight's Tour Problem</p>
                        <p className='game_desc'>Move a knight across the entire chessboard, visiting every square exactly once. Can you complete the full tour without retracing your steps? </p>
                        <p style={{ fontWeight: '400', color: 'red' }}>Click to Play &rarr;</p>
                    </div>
                </div>
            </div>
            <div className='footer'>
                <div className='team_members'>
                    <p className='member' style={{fontWeight:'bold', fontSize:'large'}}>Group Members</p>
                    <p className='member'>COBSCCOMP242P-026 - M.Z.M.B. Hamza</p>
                    <p className='member'>COBSCCOMP242P-007 - S.M.M. Shafran</p>
                    <p className='member'>COBSCCOMP242P-024 - G.A.U. Perera</p>
                    <p className='member'>COBSCCOMP242P-039 - U.D.V.Madushamini</p>
                    <p className='member'>COBSCCOMP242P-009 - C.H. Mallikarathne</p>
                </div>
            </div>
        </div>
    )
};
