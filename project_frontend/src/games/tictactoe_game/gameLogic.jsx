
import { useState } from 'react';

export function useGameLogic() {
  const [cells, setCells] = useState(
    Array(5).fill(null).map(() => Array(5).fill(''))
  );

  const [isXNext, setIsXNext] = useState(true);

  const handleCellClick = (rowIndex, colIndex) => {
    if (cells[rowIndex][colIndex] !== '') return;

    const newCells = cells.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (rIdx === rowIndex && cIdx === colIndex) {
          return isXNext ? 'X' : 'O';
        }
        return cell;
      })
    );

    setCells(newCells);
    setIsXNext(!isXNext); // Switch turns between X and O
  };

  return {
    cells,
    isXNext,
    handleCellClick,
  };
}
