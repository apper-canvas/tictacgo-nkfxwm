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
  const TriangleIcon = getIcon('Triangle');
  const SquareIcon = getIcon('Square');
  const SettingsIcon = getIcon('Settings');
  const UsersIcon = getIcon('Users');
  const LayoutGridIcon = getIcon('LayoutGrid');

  // Game configuration
  const [gridSize, setGridSize] = useState(3);
  const [playerCount, setPlayerCount] = useState(2);
  const [showSettings, setShowSettings] = useState(false);
  
  // Player definitions
  const playerSymbols = ['X', 'O', 'triangle', 'square'];
  const playerIcons = [
    <XIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />,
    <CircleIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-secondary" />,
    <TriangleIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-accent" />,
    <SquareIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-500" />
  ];
  const playerColors = [
    'text-primary',
    'text-secondary',
    'text-accent',
    'text-green-500'
  ];
  const playerBgColors = [
    'bg-primary/20 text-primary',
    'bg-secondary/20 text-secondary',
    'bg-accent/20 text-accent',
    'bg-green-500/20 text-green-500'
  ];
  
  // Game state
  const [board, setBoard] = useState(Array(gridSize * gridSize).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // Update board when grid size changes
  useEffect(() => {
    resetGame();
  }, [gridSize, playerCount]);
  
  // Generate winning combinations for current grid size
  const getWinningCombinations = () => {
    const lines = [];
    const size = gridSize;
    const winLength = Math.min(5, size); // Win requires 5-in-a-row or full grid size
    
    // Rows
    for (let r = 0; r < size; r++) {
      for (let c = 0; c <= size - winLength; c++) {
        lines.push(Array.from({length: winLength}, (_, i) => r * size + (c + i)));
      }
    }
    
    // Columns
    for (let c = 0; c < size; c++) {
      for (let r = 0; r <= size - winLength; r++) {
        lines.push(Array.from({length: winLength}, (_, i) => (r + i) * size + c));
      }
    }
    
    // Diagonals (top-left to bottom-right)
    for (let r = 0; r <= size - winLength; r++) {
      for (let c = 0; c <= size - winLength; c++) {
        lines.push(Array.from({length: winLength}, (_, i) => (r + i) * size + (c + i)));
      }
    }
    
    // Diagonals (top-right to bottom-left)
    for (let r = 0; r <= size - winLength; r++) {
      for (let c = size - 1; c >= winLength - 1; c--) {
        lines.push(Array.from({length: winLength}, (_, i) => (r + i) * size + (c - i)));
      }
    }
    
    return lines;
  };
  
  // Check for winner
  const calculateWinner = (squares) => {
    const lines = getWinningCombinations();
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const firstSquare = squares[line[0]];
      
      if (firstSquare && line.every(index => squares[index] === firstSquare)) {
        return { winner: firstSquare, line };
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
    newBoard[i] = playerSymbols[currentPlayer];
    
    // Update history to current move
    const newHistory = gameHistory.slice(0, currentMove + 1);
    newHistory.push({
      squares: newBoard,
      position: i,
      player: playerSymbols[currentPlayer]
    });
    
    // Update state
    setBoard(newBoard);
    setCurrentPlayer((currentPlayer + 1) % playerCount);
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
        toast.success(`Player ${getPlayerNameBySymbol(result.winner)} wins the game!`, {
          icon: <AwardIcon className="w-5 h-5" />
        });
        // Call onGameEnd callback with result
        if (onGameEnd) onGameEnd(result.winner);
      }
    }
  };
  
  // Reset game
  const resetGame = () => {
    setBoard(Array(gridSize * gridSize).fill(null));
    setCurrentPlayer(0);
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
    setCurrentPlayer(move % playerCount);
    
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
      return `Winner: Player ${getPlayerNameBySymbol(winner)}`;
    } else {
      return `Next player: ${getPlayerNameBySymbol(playerSymbols[currentPlayer])}`;
    }
  };
  
  // Get player name from symbol
  const getPlayerNameBySymbol = (symbol) => {
    const index = playerSymbols.indexOf(symbol);
    return index >= 0 ? `${index + 1} (${symbol})` : symbol;
  };
  
  // Get winner's background color
  const getWinnerBgColor = () => {
    if (winner === 'draw') {
      return 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300';
    }
    
    if (winner) {
      const winnerIndex = playerSymbols.indexOf(winner);
      if (winnerIndex >= 0) {
        return playerBgColors[winnerIndex];
      }
    }
    return 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300';
  };
  
  // Render cell content
  const renderCellContent = (value) => {
    if (!value) return null;
    const index = playerSymbols.indexOf(value);
    return index >= 0 ? playerIcons[index] : null;
  };
  
  // Is cell in winning line
  const isWinningCell = (i) => {
    return winningLine.includes(i);
  };

  // Handle grid size change
  const changeGridSize = (size) => {
    setGridSize(size);
    setShowSettings(false);
  };
  
  // Handle player count change
  const changePlayerCount = (count) => {
    setPlayerCount(Math.min(count, 4));
    setShowSettings(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="neu-button flex items-center gap-1"
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Settings</span>
          </button>
          
          <button 
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="neu-button flex items-center gap-1"
          >
            <RotateCcwIcon className="w-4 h-4" />
            <span>{isHistoryOpen ? 'Hide History' : 'Game History'}</span>
          </button>
        </div>

        <div className="flex-grow"></div>

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
      
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-surface-100 dark:bg-surface-800 rounded-xl p-4 overflow-hidden"
          >
            <h3 className="font-medium mb-3">Game Settings</h3>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <LayoutGridIcon className="w-4 h-4" />
                <h4 className="text-sm font-medium">Grid Size</h4>
              </div>
              <div className="flex gap-2">
                {[3, 5, 7].map((size) => (
                  <button
                    key={size}
                    onClick={() => changeGridSize(size)}
                    className={`grid-size-option ${
                      gridSize === size
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-surface-200/50 dark:bg-surface-700/50 border-surface-200 dark:border-surface-700'
                    }`}
                  >
                    {size}×{size}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <UsersIcon className="w-4 h-4" />
                <h4 className="text-sm font-medium">Players</h4>
              </div>
              <div className="flex gap-2">
                {[2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => changePlayerCount(count)}
                    className={`grid-size-option ${
                      playerCount === count
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-surface-200/50 dark:bg-surface-700/50 border-surface-200 dark:border-surface-700'
                    }`}
                  >
                    {count} Players
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      
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
      
      <div className="mb-6">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {Array.from({ length: playerCount }).map((_, index) => (
            <div 
              key={index}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 ${
                currentPlayer === index && !winner 
                  ? 'bg-surface-200 dark:bg-surface-700 scale-105 shadow-soft' 
                  : ''
              }`}
            >
              <div className={`${playerColors[index]}`}>
                {playerIcons[index]}
              </div>
              <span className={`font-medium ${
                currentPlayer === index && !winner
                  ? playerColors[index] + ' font-bold'
                  : 'text-surface-600 dark:text-surface-400'
              }`}>
                Player {index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <motion.div 
          animate={{ 
            scale: winner ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 1, repeat: winner ? Infinity : 0, repeatType: "reverse" }}
          className={`text-center py-3 px-4 rounded-xl mb-4 font-bold text-lg ${getWinnerBgColor()}`}
        >
          {winner && <AwardIcon className="inline-block mr-2 mb-1 w-5 h-5" />}
          {getStatus()}
        </motion.div>
      </div>
      
      <div className={`grid grid-cols-${gridSize} gap-2 sm:gap-3 md:gap-4 mb-6`} 
           style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
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
                  className={`tic-cell-${cell.toLowerCase()}`}
                >
                  {renderCellContent(cell)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
       
      <motion.div
        key={gridSize} 
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        initial="hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-xl bg-surface-100 dark:bg-surface-800 text-sm"
      >
        <div className="flex items-start gap-2">
          <ZapIcon className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Pro Tip:</span> The first player to place five of their marks in a horizontal, vertical, or diagonal row wins the game (or all marks in a row for smaller grids). With more players, focus on both blocking others and creating your own opportunities!
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MainFeature;