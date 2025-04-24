import { useEffect, useState } from 'react';
import '../styles/chessboard.css';

export default function Chessboard({ onBoardChange, positions }) {

    const [board, setBoard] = useState(Array(8).fill(null).map(() => Array(8).fill(false)));
    const [updatedPos, setUpdatedPos] = useState([]);

    // const toggleQueen = (row, col) => {
    //     const newBoard = board.map(row => [...row]);
    //     const currentQueenCount = newBoard.flat().filter(Boolean).length; // counts of true value in the board

    //     if (!newBoard[row][col] && currentQueenCount >= 8) {
    //         alert("You can only place 8 queens.");
    //         return;
    //     }

    //     newBoard[row][col] = !newBoard[row][col]; // changes the chosen position to true or false
    //     setBoard(newBoard); // updates the board [row,col] with true/false
    // };

    const toggleQueen = (row, col) => {
        const newBoard = board.map((r, i) => {
            // Creates a new row, if it's the target row (same as `row`), copy the row
            if (i === row) {
                return [...r]; // Copies the specific row
            }
            return r; // Leaves the other rows unchanged
        });

        const currentQueenCount = newBoard.flat().filter(cell => cell === true).length; // counts how many true values (queens)

        if (!newBoard[row][col] && currentQueenCount >= 8) {
            alert("You can only place 8 queens.");
            return;
        }

        // Toggle the queen on or off (true/false)
        newBoard[row][col] = !newBoard[row][col];
        const pos = [...positions];
        if (newBoard[row][col] === true) pos[row] = col;
        else {
            const existingIndex = newBoard[row].includes(true) ? newBoard[row].indexOf(true) : undefined;
            pos[row] = existingIndex;
        }
        setUpdatedPos(pos);
        setBoard(newBoard); // Update the state with the new board
    };

    useEffect(() => {
        if (onBoardChange) {
            onBoardChange(updatedPos);
        }
    }, [board]);

    const resetBoard = () => {
        setBoard(Array(8).fill(null).map(() => Array(8).fill(false)));
        const pos = [];
        setUpdatedPos(pos);
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
                <button className='button_style' style={{ backgroundColor: 'rgb(46, 15, 21, .5)' }} onClick={() => resetBoard()}>Clear Board</button>
            </div>
        </div>
    )
};
