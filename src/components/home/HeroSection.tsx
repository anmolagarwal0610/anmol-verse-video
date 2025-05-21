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
      className="max-w-4xl w-full text-center space-y-6 mb-12"
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
            className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-700 blur-md opacity-70"
            initial="initial"
            animate="animate"
            variants={orbVariants}
          />
          
          <div className="absolute inset-3 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <Star className="w-16 h-16 text-transparent stroke-[1.5] bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700" />
              </div>
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial="initial"
                animate="animate"
                variants={sparkleVariants}
              >
                <Sparkles className="w-6 h-6 text-indigo-500" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
        variants={itemVariants}
      >
        Transform Your Ideas into Reality with{" "}
        <motion.span 
          className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 inline-block"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          AI-Powered Creativity
        </motion.span>
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-4"
        variants={itemVariants}
      >
        No AI expertise required.
      </motion.p>
      
    </motion.div>
  );
};

export default HeroSection;
