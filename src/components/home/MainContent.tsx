
import React from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import InspirationSection from './InspirationSection';
import CtaSection from './CtaSection';

const MainContent = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
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

  return (
    <motion.main
      className="relative flex-1 flex flex-col items-center justify-center px-4 py-8 mt-12 z-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <ThemeToggle />
      
      <motion.div variants={itemVariants}>
        <HeroSection />
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        viewport={{ once: true }}
      >
        <FeatureSection />
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        viewport={{ once: true, margin: "-100px" }}
      >
        <InspirationSection />
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        viewport={{ once: true, margin: "-50px" }}
      >
        <CtaSection />
      </motion.div>
    </motion.main>
  );
};

export default MainContent;
