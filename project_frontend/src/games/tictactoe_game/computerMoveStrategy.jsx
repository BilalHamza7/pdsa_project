import { getBestMoveMinimaxLite } from './minimaxLite';
import { getBestMoveHeuristicLite } from './heuristicLite';

let algorithmicMoveCounter = 0;
let moveCounter = 0; // Move counter to track computer moves

export function resetAlgorithmicCounter() {
  algorithmicMoveCounter = 0;
  moveCounter = 0;
}

function applyMoveToBoard(board, move) {
  if (!Array.isArray(board) || board.length === 0 || !board.every(row => Array.isArray(row) && row.length === board[0].length)) {
    throw new Error("Invalid board structure.");
  }

  if (!move || typeof move.row !== 'number' || typeof move.col !== 'number') {
    throw new Error("Invalid move object.");
  }

  const newBoard = board.map(row => [...row]);
  if (newBoard[move.row][move.col] === null) {
    newBoard[move.row][move.col] = 'O'; // Assuming 'O' is the computer's symbol
  } else {
    throw new Error("Move position is already occupied.");
  }

  return newBoard;
}

function measureAlgorithmTime(getBestMove, board, player) {
  if (typeof getBestMove !== 'function') {
    throw new Error("Invalid algorithm function provided.");
  }

  const start = performance.now();
  let move = null;
  let timeTaken = 0;

  try {
    if (!board || !Array.isArray(board)) {
      throw new Error("Invalid board passed to algorithm.");
    }
    if (!player || (player !== 'X' && player !== 'O')) {
      throw new Error("Invalid player passed to algorithm.");
    }
    const result = getBestMove(board, player);
    move = result ? (result.move ? { row: result.move[0], col: result.move[1] } : result) : null;
    timeTaken = performance.now() - start;
  } catch (error) {
    console.error("Error in measuring algorithm time:", error);
  }

  return { move, timeTaken: timeTaken.toFixed(3) };
}

function getRandomMove(board) {
  const emptyCells = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === null) {
        emptyCells.push({ row, col });
      }
    }
  }
  if (emptyCells.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
}

export function computerMove(board, algorithm, player) {
  let chosenMove = null;

  try {
    if (!Array.isArray(board) || board.length === 0) {
      throw new Error("Invalid board provided.");
    }
    if (typeof algorithm !== 'string' || !['minimax', 'heuristic', 'both'].includes(algorithm)) {
      throw new Error("Invalid algorithm choice. Use 'minimax', 'heuristic', or 'both'.");
    }
    if (player !== 'X' && player !== 'O') {
      throw new Error("Invalid player. Must be 'X' or 'O'.");
    }

    moveCounter++;
    algorithmicMoveCounter++;

    // Random move 
    if (moveCounter >= 8 && moveCounter <= 12) {
      chosenMove = getRandomMove(board);
      console.log("🎲 Random Move Turn"); 
    } else {
      const { move: minimaxMove } = measureAlgorithmTime(getBestMoveMinimaxLite, board, player);
      const { move: heuristicMove } = measureAlgorithmTime(getBestMoveHeuristicLite, board, player);
      console.log("🤖 Algorithm Move Turn"); 

      if (algorithm === 'both') {
        chosenMove = minimaxMove || heuristicMove;
      } else if (algorithm === 'minimax') {
        chosenMove = minimaxMove;
      } else if (algorithm === 'heuristic') {
        chosenMove = heuristicMove;
      }
    }

    if (!chosenMove) {
      throw new Error("No valid move chosen.");
    }

    return applyMoveToBoard(board, chosenMove);

  } catch (error) {
    console.error("Error in computer move:", error);
    if (typeof toast !== 'undefined') {
      toast.error(`An error occurred while calculating the computer's move: ${error.message}. Please try again.`);
    }
    if (process.env.NODE_ENV === 'test') {
      throw error;
    }
    return board;
  }
}
