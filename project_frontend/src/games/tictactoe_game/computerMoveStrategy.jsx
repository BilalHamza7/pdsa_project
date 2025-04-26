import { getBestMoveMinimaxLite } from './minimaxLite';
import { getBestMoveHeuristicLite } from './heuristicLite';



let algorithmicMoveCounter = 0;

export function resetAlgorithmicCounter() {
  algorithmicMoveCounter = 0;
}

function applyMoveToBoard(board, move) {
  // Validate the board structure before attempting to apply a move
  if (!Array.isArray(board) || board.length === 0 || !board.every(row => Array.isArray(row) && row.length === board[0].length)) {
    throw new Error("Invalid board structure.");
  }

  if (!move || typeof move.row !== 'number' || typeof move.col !== 'number') {
    throw new Error("Invalid move object.");
  }

  const newBoard = board.map(row => [...row]);
  if (newBoard[move.row][move.col] === null) {
    newBoard[move.row][move.col] = 'O';   // Assuming 'O' is the computer's move
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
  let timeTaken = null;

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
    move = null;
    timeTaken = 0;
  }

  return { move, timeTaken: timeTaken ? timeTaken.toFixed(3) : '1' };
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

    algorithmicMoveCounter++;

    const { move: minimaxMove, timeTaken: minimaxTime } = measureAlgorithmTime(getBestMoveMinimaxLite, board, player);
    const { move: heuristicMove, timeTaken: heuristicTime } = measureAlgorithmTime(getBestMoveHeuristicLite, board, player);

    // Only print timings
    console.log(`⏱️ Minimax Time: ${minimaxTime} ms`);
    console.log(`⏱️ Heuristic Time: ${heuristicTime} ms`);

    if (algorithm === 'both') {
      if (minimaxMove && heuristicMove && minimaxMove.row === heuristicMove.row && minimaxMove.col === heuristicMove.col) {
        chosenMove = minimaxMove;
      } else {
        // Favor easier win for human (60%) or strong move (40%)
        if (Math.random() < 0.4) {
          chosenMove = minimaxMove;
        } else {
          chosenMove = findWeakerMove(board);
        }
      }
    } else if (algorithm === 'minimax') {
      chosenMove = minimaxMove;
    } else if (algorithm === 'heuristic') {
      chosenMove = heuristicMove;
    }

    if (!chosenMove) {
      throw new Error("No valid move chosen by the algorithm.");
    }

    return applyMoveToBoard(board, chosenMove);

  } catch (error) {
    console.error("Error in computer move:", error);
    toast.error(`An error occurred while calculating the computer's move: ${error.message}. Please try again.`);

    if (process.env.NODE_ENV === 'test') {
      throw error;
    }

    return board;
  }
}
