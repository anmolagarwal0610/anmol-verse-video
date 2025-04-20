
import { motion } from 'framer-motion';

interface LoadingIndicatorProps {
  progress: number;
}

export const LoadingIndicator = ({ progress }: LoadingIndicatorProps) => {
  // Simplified animation variants with reduced complexity
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
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
        <span className="inline-flex space-x-1">
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
        </span>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </motion.div>
      
      <motion.div 
        className="text-xs text-center text-muted-foreground"
        variants={itemVariants}
      >
        This may take up to 30 seconds...
      </motion.div>
      
      <div className="w-full mt-4 flex justify-center">
        <div className="flex space-x-8 items-center justify-center text-xs text-muted-foreground">
          {["Processing audio", "Analyzing speech", "Creating transcript", "Finalizing"].map((step, i) => (
            <div 
              key={step} 
              className={`text-center ${progress >= (i+1) * 25 ? "text-primary font-medium" : ""}`}
            >
              <div className="mb-1">{step}</div>
              {progress >= (i+1) * 25 && (
                <div className="h-1 w-1 rounded-full bg-primary mx-auto" />
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
