// computerMoveStrategy.js
import { getBestMoveMinimaxLite } from './minimaxLite';
import { getBestMoveHeuristicLite } from './heuristicLite';

export const computerMove = (board, algorithm, player) => {
  let move;
  const shouldPlayRandom = Math.random() < 0.2; // 20% chance of randomness

  console.log(`Computer's turn! Should play random? ${shouldPlayRandom}`);

  if (shouldPlayRandom) {
    const available = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (!board[r][c]) available.push({ row: r, col: c });
      }
    }
    move = available[Math.floor(Math.random() * available.length)];
  } else {
    if (algorithm === 'minimax') {
      move = getBestMoveMinimaxLite(board, player);
    } else if (algorithm === 'heuristic') {
      move = getBestMoveHeuristicLite(board, player);
    }
  }

  if (move) {
    const newBoard = board.map(r => [...r]);
    newBoard[move.row][move.col] = player;
    console.log("Updated board after computer's move:", newBoard);
    return newBoard;
  }

  return board; // Return the same board if no move is made
};
