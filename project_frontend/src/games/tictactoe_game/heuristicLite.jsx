import { checkWinner } from './checkWinner';


  export function getBestMoveHeuristicLite(board, player) {
    const opponent = player === 'X' ? 'O' : 'X';
    const boardSize = board.length;
  
    // Function to check if the move will win the game
    const isWinningMove = (board, row, col, symbol) => {
      const tempBoard = board.map(r => [...r]);
      tempBoard[row][col] = symbol;
      return checkWinner(tempBoard) === symbol;
    };
  
    // 1. Try to win immediately
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (!board[r][c] && isWinningMove(board, r, c, player)) {
          return { row: r, col: c }; // Return winning move
        }
      }
    }
  
    // 2. Try to block opponent's win
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (!board[r][c] && isWinningMove(board, r, c, opponent)) {
          return { row: r, col: c }; // Return blocking move
        }
      }
    }
  
    // 3. Evaluate potential scores for each empty cell
    const scoreLine = (line, player) => {
      const playerCount = line.filter(cell => cell === player).length;
      const opponentCount = line.filter(cell => cell === opponent).length;
      if (playerCount > 0 && opponentCount === 0) return playerCount * playerCount;
      if (opponentCount > 0 && playerCount === 0) return opponentCount * opponentCount * 0.8; // slight penalty for opponent
      return 0;
    };
  
    const directions = [
      { dr: 0, dc: 1 },   // Horizontal
      { dr: 1, dc: 0 },   // Vertical
      { dr: 1, dc: 1 },   // Diagonal TL-BR
      { dr: 1, dc: -1 },  // Diagonal TR-BL
    ];
  
    const scoreBoard = Array(boardSize).fill(0).map(() => Array(boardSize).fill(0));
  
    // For each empty spot, calculate the potential score
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (!board[r][c]) {
          directions.forEach(({ dr, dc }) => {
            const line = [];
            for (let i = -2; i <= 2; i++) {
              const nr = r + dr * i;
              const nc = c + dc * i;
              if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize) {
                line.push(board[nr][nc]);
              }
            }
            scoreBoard[r][c] += scoreLine(line, player);
          });
  
          // Bonus: central position bias
          const centerBias = 2 - Math.abs(2 - r) - Math.abs(2 - c);
          scoreBoard[r][c] += centerBias;
        }
      }
    }
  
    // 4. Select move with highest score
    let maxScore = -1;
    let bestMoves = [];
  
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        if (!board[r][c]) {
          if (scoreBoard[r][c] > maxScore) {
            maxScore = scoreBoard[r][c];
            bestMoves = [{ row: r, col: c }];
          } else if (scoreBoard[r][c] === maxScore) {
            bestMoves.push({ row: r, col: c });
          }
        }
      }
    }
  
    // Return a random move from the best ones
    return bestMoves.length > 0 ? bestMoves[Math.floor(Math.random() * bestMoves.length)] : null;
  }
  