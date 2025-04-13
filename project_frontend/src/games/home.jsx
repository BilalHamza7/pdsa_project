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
                <div className='games_row'>
                    <div className='game' onClick={() => navigate('/ticTacToeGame')}>
                        <img className="game_image" src={tictactoeImg} alt="Tic Tac Toe Game" />
                        <p className='game_name'>Tic Tac Toe</p>
                    </div>
                    <div className='game' onClick={() => navigate('/travelingSalesmanGame')}>
                        <img className="game_image" src={travelingsalesmanImg} alt="Traveling Salesman Game" />
                        <p className='game_name'>Traveling Salesman Problem</p>
                    </div>
                    <div className='game' onClick={() => navigate('/towerOfHanoiGame')}>
                        <img className="game_image" src={towerofhanoiImg} alt="Tower of Hanoi Game" />
                        <p className='game_name'>Tower of Hanoi</p>
                    </div>
                </div>
                <div className='games_row'>
                    <div className='game' onClick={() => navigate('/eightQueensGame')}>
                        <img className="game_image" src={eightqueensImg} alt="Eight Queen's Game" />
                        <p className='game_name'>Eight Queen's Puzzle</p>
                    </div>
                    <div className='game' onClick={() => navigate('knightsTourGame')}>
                        <img className="game_image" src={knightstourImg} alt="Knight's Tour Game" />
                        <p className='game_name'>Knight's Tour Problem</p>
                    </div>
                </div>
            </div>
        </div>
    )
};
