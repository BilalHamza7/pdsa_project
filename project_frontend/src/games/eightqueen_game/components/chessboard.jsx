import { useEffect, useState } from 'react';
import '../styles/chessboard.css';

export default function Chessboard({ onBoardChange }) {

    const [board, setBoard] = useState(Array(8).fill(null).map(() => Array(8).fill(false)));

    const toggleQueen = (row, col) => {
        const newBoard = board.map(row => [...row]);
        const currentQueenCount = newBoard.flat().filter(Boolean).length; // counts of true value in the board

        if (!newBoard[row][col] && currentQueenCount >= 8) {
            alert("You can only place 8 queens.");
            return;
        }

        newBoard[row][col] = !newBoard[row][col]; // changes the chosen position to true or false
        setBoard(newBoard); // updates the board [row,col] with true/false
    };

    useEffect(() => {
        if (onBoardChange) {
            onBoardChange(board);
        }
    }, [board]);

    const resetBoard = () => {
        setBoard(Array(8).fill(null).map(() => Array(8).fill(false)));
    }

    return (
        <div className="board-container">
            <div className='row_label'>
                <p>8</p>
                <p>7</p>
                <p>6</p>
                <p>5</p>
                <p>4</p>
                <p>3</p>
                <p>2</p>
                <p>1</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="chessboard">
                    {board.map((row, rowIndex) =>
                        row.map((hasQueen, colIndex) => {
                            const isWhite = (rowIndex + colIndex) % 2 === 0;
                            return (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`board_cell ${isWhite ? 'white' : 'black'}`}
                                    onClick={() => toggleQueen(rowIndex, colIndex)}
                                >
                                    {hasQueen && <span className="queen">♛</span>}
                                </div>
                            );
                        })
                    )}
                </div>
                <div className='col_label'>
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                </div>
                <button className='button_style' style={{ backgroundColor:'rgb(46, 15, 21, .5)' }} onClick={() => resetBoard()}>Clear Board</button>
            </div>
        </div>
    )
};
