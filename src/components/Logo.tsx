
import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';

const orbVariants = {
  initial: { scale: 1, opacity: 0.5 },
  animate: {
    scale: [1, 1.03, 1],
    opacity: [0.5, 0.7, 0.5],
    transition: {
      repeat: Infinity,
      repeatType: "mirror" as const,
      duration: 2.5
    }
  }
};

const sparkleVariants = {
  initial: { rotate: 0, scale: 0.8 },
  animate: {
    rotate: [0, 360],
    scale: [0.8, 1, 0.8],
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: "linear"
    }
  }
};

const Logo = () => {
  return (
    <motion.div
      className="relative h-8 w-8" // Corresponds to 32px
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial="initial"
      animate="animate"
    >
      {/* Pulsing Orb Background - Royal Purple via Sky Blue to Royal Purple */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6A0DAD] via-[#4FC3F7] to-[#6A0DAD] blur-sm opacity-70"
        variants={orbVariants}
      />
      
      {/* Inner Circle with Content */}
      <div className="absolute inset-[3px] bg-background rounded-full flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          {/* Star Icon - Royal Purple via Sky Blue to Midnight Blue */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Star className="w-[18px] h-[18px] text-transparent stroke-[2px] bg-clip-text bg-gradient-to-r from-[#6A0DAD] via-[#4FC3F7] to-[#0A0F3C]" />
          </div>
          
          {/* Rotating Sparkles - Sky Blue */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            variants={sparkleVariants}
          >
            <Sparkles className="w-2.5 h-2.5 text-[#4FC3F7]" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Logo;

