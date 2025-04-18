
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
        {/* Conical Funnel */}
        <motion.path
          d="M40 20 L60 20 L70 70 L30 70 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Rotating Spark */}
        <motion.g
          animate={{ 
            rotate: 360
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <path
            d="M45 35 L55 35 L50 25 Z"
            fill="currentColor"
          />
        </motion.g>

        {/* Effervescence Bubbles */}
        <motion.g
          initial={{ opacity: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            y: [-10, -30]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0.5
          }}
        >
          <circle cx="45" cy="65" r="2" fill="currentColor" />
          <circle cx="50" cy="60" r="3" fill="currentColor" />
          <circle cx="55" cy="63" r="2" fill="currentColor" />
        </motion.g>

        {/* Blast Effect at Top */}
        <motion.g
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.2, 0.8],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 0.5
          }}
        >
          <path
            d="M35 15 L50 5 L65 15"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </motion.g>
      </motion.svg>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/50 to-purple-600/50 rounded-lg animate-pulse blur-sm -z-10" />
    </motion.div>
  );
};

export default Logo;
