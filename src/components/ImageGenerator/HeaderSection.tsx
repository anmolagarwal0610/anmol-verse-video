
import { motion } from 'framer-motion';

const HeaderSection = () => {
  return (
    <motion.div 
      className="max-w-3xl w-full text-center space-y-4 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div 
        // Gradient Cool Lilac to Sky Blue Tint, Text Off-Black
        className="inline-block bg-gradient-to-r from-[rgb(var(--primary-rgb))] to-[rgb(var(--accent-rgb))] text-accent-foreground px-4 py-1 rounded-full text-sm font-medium mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        AI-powered image generation
      </motion.div>
      
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight break-words text-foreground"> {/* Text Cloud White */}
        {/* Cool Lilac to Sky Blue Tint gradient for "images" */}
        Generate sophisticated <span className="text-gradient-primary-accent">images</span> from text
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto"> {/* Muted text */}
        Transform your concepts into high-quality visuals with elegant precision.
      </p>
    </motion.div>
  );
};

export default HeaderSection;
