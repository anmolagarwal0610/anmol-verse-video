
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import InspirationSection from './InspirationSection';
import CtaSection from './CtaSection';

const MainContent = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  
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
      
      <motion.div 
        style={{ opacity, scale }} 
        className="w-full"
      >
        <HeroSection />
      </motion.div>
      
      <motion.div 
        id="features"
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full"
      >
        <FeatureSection />
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full"
      >
        <InspirationSection />
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="w-full"
      >
        <CtaSection />
      </motion.div>
    </motion.main>
  );
};

export default MainContent;
