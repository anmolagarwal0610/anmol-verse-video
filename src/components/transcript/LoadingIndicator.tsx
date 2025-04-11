
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface LoadingIndicatorProps {
  progress: number;
}

export const LoadingIndicator = ({ progress }: LoadingIndicatorProps) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const progressVariants = {
    initial: { width: "0%" },
    animate: { width: `${progress}%` }
  };

  // Animated dots that appear during loading
  const loadingDots = {
    animate: {
      opacity: [0, 1, 0],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        repeatType: "loop",
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }
    }
  };

  return (
    <motion.div 
      className="mt-8 space-y-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex items-center space-x-2" variants={itemVariants}>
        <p className="text-sm text-muted-foreground">
          Generating your transcript
        </p>
        <motion.span
          className="inline-flex space-x-1"
          variants={loadingDots}
          animate="animate"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1 w-1 rounded-full bg-primary inline-block"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.span>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>
      
      <motion.div 
        className="text-xs text-center text-muted-foreground"
        variants={itemVariants}
      >
        This may take up to 30 seconds...
      </motion.div>
      
      <motion.div
        className="w-full mt-4 flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div 
          className="flex space-x-8 items-center justify-center text-xs text-muted-foreground"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
          }}
        >
          {["Processing audio", "Analyzing speech", "Creating transcript", "Finalizing"].map((step, i) => (
            <div 
              key={step} 
              className={`text-center ${progress >= (i+1) * 25 ? "text-primary font-medium" : ""}`}
            >
              <div className="mb-1">{step}</div>
              {progress >= (i+1) * 25 && (
                <motion.div 
                  className="h-1 w-1 rounded-full bg-primary mx-auto"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
