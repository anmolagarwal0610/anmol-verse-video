
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <motion.div 
      className="relative h-8 w-8"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Flask Container */}
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full text-indigo-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Flask outline */}
        <motion.path
          d="M30 20 L40 40 L40 75 C40 85 60 85 60 75 L60 40 L70 20 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        
        {/* Circuit paths */}
        <motion.path
          d="M45 60 L55 60 M45 65 L50 70 M55 65 L50 70"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        />
        
        {/* Animated bubbles */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          <circle cx="45" cy="35" r="2" fill="currentColor" />
          <circle cx="50" cy="30" r="3" fill="currentColor" />
          <circle cx="55" cy="35" r="2" fill="currentColor" />
          <circle cx="48" cy="25" r="2" fill="currentColor" />
        </motion.g>
      </motion.svg>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/50 to-purple-600/50 rounded-lg animate-pulse blur-sm -z-10" />
    </motion.div>
  );
};

export default Logo;
