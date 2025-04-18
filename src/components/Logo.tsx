
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <motion.div 
      className="relative h-8 w-8"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full text-indigo-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Conical Flask */}
        <motion.path
          d="M35 20 L45 50 L30 80 C30 85 70 85 70 80 L55 50 L65 20 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        
        {/* Gear */}
        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <path
            d="M50 45 L52 40 L54 42 L52 47 Z M48 40 L46 42 L48 47 L50 45 Z M45 48 L40 48 L40 52 L45 52 Z M48 53 L46 58 L48 60 L50 55 Z M52 53 L50 55 L52 58 L54 58 Z M55 48 L60 48 L60 52 L55 52 Z"
            fill="currentColor"
            strokeWidth="1"
          />
        </motion.g>

        {/* Blast Effect */}
        <motion.g
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.2, 0.8],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0.5
          }}
        >
          <path
            d="M40 15 L50 5 L60 15"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="50" cy="10" r="2" fill="currentColor" />
        </motion.g>

        {/* Bubbles */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          <circle cx="45" cy="60" r="2" fill="currentColor" />
          <circle cx="50" cy="65" r="3" fill="currentColor" />
          <circle cx="55" cy="62" r="2" fill="currentColor" />
        </motion.g>
      </motion.svg>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/50 to-purple-600/50 rounded-lg animate-pulse blur-sm -z-10" />
    </motion.div>
  );
};

export default Logo;
