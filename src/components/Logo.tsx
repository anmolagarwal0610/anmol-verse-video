
import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react'; // Keep for consistency with Hero icon

const orbVariants = {
  initial: { scale: 1, opacity: 0.4 }, // Subtler opacity
  animate: {
    scale: [1, 1.03, 1],
    opacity: [0.4, 0.6, 0.4], // Subtler opacity changes
    transition: {
      repeat: Infinity,
      repeatType: "mirror" as const,
      duration: 3 // Slightly faster for small logo
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
      {/* Pulsing Orb Background - Cool Lilac to Sky Blue Tint */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-cool-lilac/80 via-sky-blue-tint/80 to-cool-lilac/80 blur-sm opacity-70"
        variants={orbVariants}
      />
      
      <div className="absolute inset-[3px] bg-off-black/70 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden"> {/* Inner circle with dark bg */}
        <div className="relative w-full h-full">
          {/* Star Icon - Light Cyan to Sky Blue Tint */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Star className="w-[18px] h-[18px] text-transparent stroke-[2px] bg-clip-text bg-gradient-to-r from-light-cyan via-sky-blue-tint to-cool-lilac" />
          </div>
          
          {/* Rotating Sparkles - Sky Blue Tint */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            variants={sparkleVariants}
          >
            <Sparkles className="w-2.5 h-2.5 text-sky-blue-tint" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Logo;
