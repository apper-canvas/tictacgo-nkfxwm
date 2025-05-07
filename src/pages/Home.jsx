import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const Home = ({ isDarkMode }) => {
  const GamepadIcon = getIcon('Gamepad');
  const TrophyIcon = getIcon('Trophy');
  
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    xWins: 0,
    oWins: 0,
    draws: 0
  });

  const updateGameStats = (result) => {
    setGameStats(prev => {
      const newStats = {
        gamesPlayed: prev.gamesPlayed + 1,
        xWins: prev.xWins + (result === 'X' ? 1 : 0),
        oWins: prev.oWins + (result === 'O' ? 1 : 0),
        draws: prev.draws + (result === 'draw' ? 1 : 0)
      };
      
      // Show stats milestone toasts
      if (newStats.gamesPlayed === 5) {
        toast.info("You've played 5 games! Getting competitive!", {
          icon: <TrophyIcon className="w-6 h-6" />
        });
      }
      
      if (newStats.xWins + newStats.oWins + newStats.draws === 10) {
        toast.success("10 games completed! You're a TicTacToePro master!", {
          icon: <TrophyIcon className="w-6 h-6" />
        });
      }
      
      return newStats;
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <section className="mb-8 md:mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h1 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
            TicTacToePro
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-surface-600 dark:text-surface-300">
            The professional Tic Tac Toe experience reimagined. Challenge a friend and see who comes out on top!
          </p>
        </motion.div>
        
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <GamepadIcon className="w-5 h-5 text-primary" />
            <span className="font-medium">Games Played: {gameStats.gamesPlayed}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">X</span>
            <span className="font-medium">Wins: {gameStats.xWins}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-secondary">O</span>
            <span className="font-medium">Wins: {gameStats.oWins}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-accent" />
            <span className="font-medium">Draws: {gameStats.draws}</span>
          </div>
        </div>
      </section>
      
      <MainFeature isDarkMode={isDarkMode} onGameEnd={updateGameStats} />
      
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-4 text-center">How to Play</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="card border border-surface-200 dark:border-surface-700"
          >
            <div className="text-xl font-bold mb-2 text-primary">Take Turns</div>
            <p>Players alternate placing X and O marks on the 3×3 grid. X goes first.</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="card border border-surface-200 dark:border-surface-700"
          >
            <div className="text-xl font-bold mb-2 text-primary">Form a Line</div>
            <p>The first player to get three of their marks in a row (horizontally, vertically, or diagonally) wins!</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="card border border-surface-200 dark:border-surface-700"
          >
            <div className="text-xl font-bold mb-2 text-primary">Draw Game</div>
            <p>If the grid fills up with neither player getting three in a row, the game ends in a draw.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;