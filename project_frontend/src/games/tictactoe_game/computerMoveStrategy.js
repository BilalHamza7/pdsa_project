import { getBestMoveMinimaxLite } from './minimaxLite';
import { getBestMoveHeuristicLite } from './heuristicLite';

let randomMoveCounter = 0; // Tracks total random moves
let algorithmicMoveCounter = 0; // Tracks total algorithmic moves
let moveCounter = 0; // Tracks the total number of moves made

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

function getRandomMove(board) {
  const emptyCells = [];
  board.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === null) emptyCells.push({ row: r, col: c });
    });
  });
  return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
}

export function computerMove(board, algorithm, player) {
  let minimaxMove = null;
  let heuristicMove = null;
  let chosenMove = null;

  moveCounter++; // Increment the total move counter

  // Apply random move every 3rd move
  const shouldDoRandomMove = moveCounter % 3 === 0 && randomMoveCounter < 5; // Random move every 3rd move, max 5 random moves

  if (shouldDoRandomMove) {
    chosenMove = getRandomMove(board);
    randomMoveCounter++;
    console.log('🎲 Random Move (Every 3rd move)');
    console.log(`Random Move #${randomMoveCounter}`);
    return applyMoveToBoard(board, chosenMove);
  }

  // Measure the time for Minimax
  const { move: minimaxMoveResult, timeTaken: minimaxTime } = measureAlgorithmTime(getBestMoveMinimaxLite, board, player);
  minimaxMove = minimaxMoveResult;

  // Measure the time for Heuristic
  const { move: heuristicMoveResult, timeTaken: heuristicTime } = measureAlgorithmTime(getBestMoveHeuristicLite, board, player);
  heuristicMove = heuristicMoveResult;

  // Logging only the algorithm times
  console.log(`⏱️ Minimax Time: ${minimaxTime} ms`);
  console.log(`⏱️ Heuristic Time: ${heuristicTime} ms`);

  // Algorithmic move decision
  if (algorithm === 'both') {
    // If both algorithms return the same move, choose it (no randomness here)
    if (minimaxMove.row === heuristicMove.row && minimaxMove.col === heuristicMove.col) {
      chosenMove = minimaxMove;  
    } else {
      // 50% chance to pick the move from either Minimax or Heuristic if they return different moves
      const randomChoice = Math.random();
      chosenMove = randomChoice < 0.5 ? minimaxMove : heuristicMove;  
    }
  } else if (algorithm === 'minimax') {
    chosenMove = minimaxMove;
  } else if (algorithm === 'heuristic') {
    chosenMove = heuristicMove;
  }

  algorithmicMoveCounter++; // Count this as an algorithmic move
  console.log(`Algorithmic Move #${algorithmicMoveCounter}`);
  return applyMoveToBoard(board, chosenMove);
}
