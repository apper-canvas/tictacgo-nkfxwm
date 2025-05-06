import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  const navigate = useNavigate();
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const HomeIcon = getIcon('Home');

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <motion.div 
          animate={{ 
            rotate: [0, 5, -5, 5, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="flex justify-center mb-6"
        >
          <AlertTriangleIcon className="w-24 h-24 text-secondary" />
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-surface-800 dark:text-surface-100">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-surface-700 dark:text-surface-200">Page Not Found</h2>
        
        <p className="text-lg mb-8 text-surface-600 dark:text-surface-300">
          Oops! It seems like the page you're looking for doesn't exist or has been moved.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 mx-auto btn-primary"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Back to Home</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;