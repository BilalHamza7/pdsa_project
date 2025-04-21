import { getBestMoveMinimaxLite } from './minimaxLite';
import { getBestMoveHeuristicLite } from './heuristicLite';

let algorithmicMoveCounter = 0;

export function resetAlgorithmicCounter() {
  algorithmicMoveCounter = 0;
}

function applyMoveToBoard(board, move) {
  const newBoard = board.map(row => [...row]);
  if (move && newBoard[move.row][move.col] === null) {
    newBoard[move.row][move.col] = 'O';
  }
  return newBoard;
}

function measureAlgorithmTime(getBestMove, board, player) {
  const start = performance.now();
  const move = getBestMove(board, player);
  const timeTaken = performance.now() - start;
  return { move, timeTaken: timeTaken.toFixed(3) };
}

export function computerMove(board, algorithm, player) {
  let chosenMove = null;


  algorithmicMoveCounter++;
  console.log(`Algorithmic Move #${algorithmicMoveCounter}`);

  // Measure algorithm times
  const { move: minimaxMove, timeTaken: minimaxTime } = measureAlgorithmTime(getBestMoveMinimaxLite, board, player);
  const { move: heuristicMove, timeTaken: heuristicTime } = measureAlgorithmTime(getBestMoveHeuristicLite, board, player);

  console.log(`⏱️ Minimax Time: ${minimaxTime} ms`);
  console.log(`⏱️ Heuristic Time: ${heuristicTime} ms`);

  if (algorithm === 'both') {
    if (minimaxMove.row === heuristicMove.row && minimaxMove.col === heuristicMove.col) {
      chosenMove = minimaxMove;
    } else {
      chosenMove = Math.random() < 0.5 ? minimaxMove : heuristicMove;
    }
  } else if (algorithm === 'minimax') {
    chosenMove = minimaxMove;
  } else if (algorithm === 'heuristic') {
    chosenMove = heuristicMove;
  }

  
  return applyMoveToBoard(board, chosenMove);
}
