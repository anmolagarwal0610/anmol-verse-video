
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BackgroundImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  // Updated image URL
  const imageUrl = 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a'; // Clear Glass Roof

  useEffect(() => {
    console.log('BackgroundImage: Starting to load image');
    const startTime = performance.now();
    
    // Preload the image
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const endTime = performance.now();
      console.log(`BackgroundImage: Image loaded in ${endTime - startTime}ms`);
      setIsLoaded(true);
    };
    
    img.onerror = (e) => {
      console.error('BackgroundImage: Failed to load image:', e);
      // Set loaded to true anyway to show a fallback
      setIsLoaded(true);
    };
  }, []);

  return (
    <>
      {/* Animated gradient placeholder while loading */}
      {!isLoaded && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-indigo-900/20"
          animate={{
            background: [
              "linear-gradient(to bottom, rgba(91, 33, 182, 0.2), rgba(67, 56, 202, 0.2))",
              "linear-gradient(to bottom, rgba(79, 70, 229, 0.2), rgba(91, 33, 182, 0.2))",
              "linear-gradient(to bottom, rgba(67, 56, 202, 0.2), rgba(79, 70, 229, 0.2))",
              "linear-gradient(to bottom, rgba(91, 33, 182, 0.2), rgba(67, 56, 202, 0.2))"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}
      
      {/* Animated background image */}
      <motion.div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${isLoaded ? 'opacity-10 dark:opacity-20' : 'opacity-0'}`}
        style={{ backgroundImage: isLoaded ? `url('${imageUrl}')` : 'none' }}
        initial={{ scale: 1.05 }}
        animate={isLoaded ? { scale: 1 } : {}}
        transition={{ duration: 10, ease: "easeOut" }}
      />
      
      {/* Floating particles effect */}
      {isLoaded && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 md:w-2 md:h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5
              }}
              animate={{
                y: [0, -(Math.random() * 100 + 50)],
                opacity: [Math.random() * 0.3 + 0.1, 0],
                scale: [1, Math.random() + 0.5]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default BackgroundImage;
