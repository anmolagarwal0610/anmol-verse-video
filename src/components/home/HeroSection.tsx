
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';

const HeroSection = () => {
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0, rotate: -10 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };
  
  const orbVariants = {
    initial: { scale: 1, opacity: 0.7 },
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        repeat: Infinity,
        repeatType: "mirror" as const,
        duration: 3
      }
    }
  };
  
  const sparkleVariants = {
    initial: { rotate: 0, scale: 1 },
    animate: {
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      transition: {
        repeat: Infinity,
        duration: 5,
        ease: "linear"
      }
    }
  };

  return (
    <motion.div 
      className="max-w-4xl w-full text-center space-y-6 mb-12 text-foreground" // Changed text-cloud-white to text-foreground
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={logoVariants}
        className="mx-auto mb-6"
      >
        <div className="relative w-32 h-32 mx-auto">
          <motion.div 
            className="absolute inset-0 rounded-full blur-md opacity-70 dark:bg-gradient-to-r dark:from-[#B4A7FF] dark:via-[#8EC5FC] dark:to-[#B4A7FF] bg-gradient-to-r from-[#B4A7FF] via-[#8EC5FC] to-[#B4A7FF]"
            initial="initial"
            animate="animate"
            variants={orbVariants}
          />
          
          <div className="absolute inset-3 bg-background rounded-full flex items-center justify-center overflow-hidden"> {/* Uses bg-background (theme-aware) */}
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Star gradient uses theme colors and fades to background */}
                <Star className="w-16 h-16 text-transparent stroke-[1.5] bg-clip-text bg-gradient-to-r from-primary via-accent to-background" />
              </div>
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial="initial"
                animate="animate"
                variants={sparkleVariants}
              >
                {/* Sparkles use accent color */}
                <Sparkles className="w-6 h-6 text-accent" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground" // Changed text-cloud-white to text-foreground
        variants={itemVariants}
      >
        Transform Your Ideas into Reality with{" "}
        <motion.span 
          className="text-primary inline-block" // Changed text-cool-lilac to text-primary
        >
          AI-Powered Creativity
        </motion.span>
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-4" // Already theme-aware
        variants={itemVariants}
      >
        No AI expertise required.
      </motion.p>
      
    </motion.div>
  );
};

export default HeroSection;
