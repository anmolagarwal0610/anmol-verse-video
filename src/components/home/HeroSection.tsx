
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <motion.div 
      className="max-w-4xl w-full text-center space-y-6 mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mx-auto mb-6"
      >
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 animate-pulse blur-md opacity-70"></div>
          <div className="absolute inset-3 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <Star className="w-16 h-16 text-transparent stroke-[1.5] bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
        Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">AnmolVerse</span>
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
        Your futuristic creative studio powered by advanced AI. Create stunning images, 
        videos, and transcripts with just a few clicks.
      </p>
    </motion.div>
  );
};

export default HeroSection;
