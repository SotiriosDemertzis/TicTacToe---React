import { useState } from "react";

/**
 * Square Component
 * 
 * Represents a single square on the Tic-Tac-Toe board.
 * This is a controlled component that receives its value and click handler from parent.
 * 
 * @param {string|null} value - The value to display in the square ("X", "O", or null)
 * @param {Function} onSquareClick - Callback function to handle square clicks
 * @returns {JSX.Element} A button element representing the square
 */
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

/**
 * Board Component
 * 
 * Renders the 3x3 Tic-Tac-Toe game board with 9 squares.
 * Manages the game logic for handling moves and determining game status.
 * 
 * @param {boolean} xIsNext - Whether it's X's turn (true) or O's turn (false)
 * @param {Array} squares - Array of 9 elements representing the board state
 * @param {Function} onPlay - Callback function to handle when a move is made
 * @returns {JSX.Element} The complete game board with status display
 */
function Board({ xIsNext, squares, onPlay }) {
  /**
   * Handles click events on individual squares
   * 
   * @param {number} i - Index of the clicked square (0-8)
   */
  function handleClick(i) {
    // Early return if square is already filled or game is won
    if (squares[i] || calculateWinner(squares)) return;
    
    // Create a copy of squares array to avoid direct mutation
    const nextSquares = squares.slice();
    
    // Set the square value based on whose turn it is
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    
    // Call parent's onPlay function with the updated board state
    onPlay(nextSquares);
  }

  // Check if there's a winner and set appropriate status message
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {/* First row of squares */}
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      {/* Second row of squares */}
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      {/* Third row of squares */}
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

/**
 * Game Component (Main Component)
 * 
 * The root component that manages the overall game state, including:
 * - Game history for time travel functionality
 * - Current move tracking
 * - Game board rendering
 * - Move history display
 * 
 * @returns {JSX.Element} The complete Tic-Tac-Toe game interface
 */
export default function Game() {
  // State for storing all game moves - starts with empty board
  const [history, setHistory] = useState([Array(9).fill(null)]);
  
  // State for tracking which move we're currently viewing
  const [currentMove, setCurrentMove] = useState(0);
  
  // Determine whose turn it is based on move number (even = X, odd = O)
  const xIsNext = currentMove % 2 === 0;
  
  // Get the current board state from history
  const currentSquares = history[currentMove];

  /**
   * Handles when a player makes a move
   * Updates the game history and advances to the next move
   * 
   * @param {Array} nextSquares - The new board state after the move
   */
  function handlePlay(nextSquares) {
    // Create new history by taking current history up to current move
    // and adding the new board state (this removes any "future" moves)
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  /**
   * Allows jumping to any previous move in the game
   * 
   * @param {number} nextMove - The move number to jump to
   */
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Generate list of move buttons for time travel functionality
  const moves = history.map((squares, move) => {
    let description;
    move > 0 
      ? description = `Go to move #${move}` 
      : description = 'Go to game start';
    
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board 
          xIsNext={xIsNext} 
          squares={currentSquares} 
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <h1>Game info</h1>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

/**
 * Utility function to determine if there's a winner
 * 
 * Checks all possible winning combinations on the Tic-Tac-Toe board.
 * 
 * @param {Array} squares - Array of 9 elements representing the board state
 * @returns {string|null} Returns "X" or "O" if there's a winner, null otherwise
 */
function calculateWinner(squares) {
  // All possible winning line combinations
  const lines = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
  ];
  
  // Check each possible winning combination
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // If all three squares in a line have the same non-null value, we have a winner
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  
  return null; // No winner found
}