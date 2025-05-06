import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = ({ isDarkMode, onGameEnd }) => {
  // Get icons
  const RefreshCwIcon = getIcon('RefreshCw');
  const AwardIcon = getIcon('Award');
  const XIcon = getIcon('X');
  const CircleIcon = getIcon('Circle');
  const InfoIcon = getIcon('Info');
  const RotateCcwIcon = getIcon('RotateCcw');
  const ZapIcon = getIcon('Zap');
  
  // Game state
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // Winning combinations
  const lines = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal from top left
    [2, 4, 6], // diagonal from top right
  ];
  
  // Check for winner
  const calculateWinner = (squares) => {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    // Check for draw
    if (squares.every(square => square !== null)) {
      return { winner: 'draw', line: [] };
    }
    return { winner: null, line: [] };
  };
  
  // Handle cell click
  const handleClick = (i) => {
    // Return if cell is already filled or game is over
    if (board[i] || winner) return;
    
    // Create new board with the move
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    
    // Update history to current move
    const newHistory = gameHistory.slice(0, currentMove + 1);
    newHistory.push({
      squares: newBoard,
      position: i,
      player: isXNext ? 'X' : 'O'
    });
    
    // Update state
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setGameHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
    
    // Check for winner after move
    const result = calculateWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      
      // Show toast for game result
      if (result.winner === 'draw') {
        toast.info("It's a draw! The game ended in a tie.", {
          icon: <InfoIcon className="w-5 h-5" />
        });
        // Call onGameEnd callback with result
        if (onGameEnd) onGameEnd('draw');
      } else {
        toast.success(`Player ${result.winner} wins the game!`, {
          icon: <AwardIcon className="w-5 h-5" />
        });
        // Call onGameEnd callback with result
        if (onGameEnd) onGameEnd(result.winner);
      }
    }
  };
  
  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
    setGameHistory([]);
    setCurrentMove(0);
    toast.info("Game has been reset!", {
      icon: <RefreshCwIcon className="w-5 h-5" />
    });
  };
  
  // Jump to specific move in history
  const jumpTo = (move) => {
    setCurrentMove(move);
    const historicalBoard = gameHistory[move].squares;
    setBoard(historicalBoard);
    setIsXNext(move % 2 === 0);
    
    // Recalculate winner for this board state
    const result = calculateWinner(historicalBoard);
    setWinner(result.winner);
    setWinningLine(result.line);
  };
  
  // Get status message
  const getStatus = () => {
    if (winner === 'draw') {
      return "Game ended in a draw!";
    } else if (winner) {
      return `Winner: Player ${winner}`;
    } else {
      return `Next player: ${isXNext ? 'X' : 'O'}`;
    }
  };
  
  // Render cell content
  const renderCellContent = (value) => {
    if (!value) return null;
    
    return value === 'X' ? (
      <XIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
    ) : (
      <CircleIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-secondary" />
    );
  };
  
  // Is cell in winning line
  const isWinningCell = (i) => {
    return winningLine.includes(i);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div className="text-xl font-bold">
          <span className={`${isXNext && !winner ? 'text-primary font-extrabold scale-110 inline-block' : 'text-surface-600 dark:text-surface-400'} transition-all duration-300`}>
            Player X
          </span>
          <span className="mx-2 text-surface-400">vs</span>
          <span className={`${!isXNext && !winner ? 'text-secondary font-extrabold scale-110 inline-block' : 'text-surface-600 dark:text-surface-400'} transition-all duration-300`}>
            Player O
          </span>
        </div>
        
        <button 
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="text-sm flex items-center gap-1 neu-button"
        >
          <RotateCcwIcon className="w-4 h-4" />
          {isHistoryOpen ? 'Hide History' : 'Game History'}
        </button>
      </div>
      
      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-surface-100 dark:bg-surface-800 rounded-xl p-4 overflow-hidden"
          >
            <h3 className="font-medium mb-2">Game Moves:</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => jumpTo(0)}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${currentMove === 0 
                  ? 'bg-primary text-white' 
                  : 'bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600'}`}
              >
                Game Start
              </button>
              
              {gameHistory.slice(1).map((_, move) => {
                const actualMove = move + 1;
                const description = `Move #${actualMove}`;
                return (
                  <button
                    key={actualMove}
                    onClick={() => jumpTo(actualMove)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${currentMove === actualMove 
                      ? 'bg-primary text-white' 
                      : 'bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600'}`}
                  >
                    {description}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="mb-4">
        <motion.div 
          animate={{ 
            scale: winner ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 1, repeat: winner ? Infinity : 0, repeatType: "reverse" }}
          className={`text-center py-3 px-4 rounded-xl mb-4 font-bold text-lg
                    ${winner === 'X' ? 'bg-primary/20 text-primary' : 
                      winner === 'O' ? 'bg-secondary/20 text-secondary' : 
                      winner === 'draw' ? 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300' : 
                      'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300'}`}
        >
          {winner && <AwardIcon className="inline-block mr-2 mb-1 w-5 h-5" />}
          {getStatus()}
        </motion.div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6">
        {board.map((cell, i) => (
          <motion.button
            key={i}
            whileHover={!cell && !winner ? { scale: 1.05 } : {}}
            whileTap={!cell && !winner ? { scale: 0.95 } : {}}
            onClick={() => handleClick(i)}
            disabled={!!cell || !!winner}
            className={`game-cell aspect-square ${isWinningCell(i) ? 
              'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-800' : ''}`}
            aria-label={`Cell ${i}`}
          >
            <AnimatePresence mode="wait">
              {cell && (
                <motion.div
                  key={cell}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className={`${cell === 'X' ? 'tic-cell-x' : 'tic-cell-o'}`}
                >
                  {renderCellContent(cell)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
      
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCwIcon className="w-5 h-5" />
          <span>New Game</span>
        </motion.button>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-xl bg-surface-100 dark:bg-surface-800 text-sm"
      >
        <div className="flex items-start gap-2">
          <ZapIcon className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Pro Tip:</span> The first player to place three of their marks in a horizontal, vertical, or diagonal row wins the game. Try to block your opponent while setting up your own winning line!
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MainFeature;