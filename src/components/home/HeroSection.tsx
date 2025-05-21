import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react'; // Keeping Star and Sparkles for the icon

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
    initial: { scale: 1, opacity: 0.5 },
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 0.8, 0.5], // Slightly increased opacity
      transition: {
        repeat: Infinity,
        repeatType: "mirror" as const,
        duration: 3.5 // Slightly slower
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
      className="max-w-4xl w-full text-center space-y-8 mb-16 pt-24 md:pt-32" // Added padding top
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Centered glowing icon */}
      <motion.div
        variants={logoVariants}
        className="mx-auto mb-8" // Increased margin bottom
      >
        <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto"> {/* Slightly larger icon */}
          <motion.div 
            // Glowing orb using new accent colors: Cool Lilac to Sky Blue Tint
            className="absolute inset-0 rounded-full bg-gradient-to-br from-cool-lilac via-sky-blue-tint to-cool-lilac blur-lg opacity-60"
            initial="initial"
            animate="animate"
            variants={orbVariants}
          />
          
          <div className="absolute inset-2 bg-off-black/80 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden"> {/* Inner circle with slight transparency */}
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Star gradient: Light Cyan to Cool Lilac */}
                <Star className="w-12 h-12 md:w-16 md:h-16 text-transparent stroke-[1.5] bg-clip-text bg-gradient-to-r from-light-cyan via-cool-lilac to-sky-blue-tint" />
              </div>
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial="initial"
                animate="animate"
                variants={sparkleVariants}
              >
                {/* Sparkles color: Sky Blue Tint */}
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-sky-blue-tint" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-cloud-white" // Main heading in bold white
        variants={itemVariants}
      >
        Transform Your Ideas into Reality
      </motion.h1>
      
      <motion.h2 
        className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-cool-lilac" // Subheading in Cool Lilac
        variants={itemVariants}
        style={{ transitionDelay: '0.2s' }} // Stagger animation slightly
      >
        AI-Powered Creativity
      </motion.h2>
      
      <motion.p 
        className="text-lg md:text-xl text-light-gray-text max-w-xl mx-auto mt-6 font-light" // Supporting line in light gray, font-light
        variants={itemVariants}
        style={{ transitionDelay: '0.4s' }} // Stagger animation
      >
        No AI expertise required.
      </motion.p>
      
    </motion.div>
  );
};

export default HeroSection;
