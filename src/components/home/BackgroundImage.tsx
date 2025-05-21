import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BackgroundImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  // Using a darker, more abstract image suitable for the new theme
  const imageUrl = 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=1920'; // Abstract dark texture

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
  }, [imageUrl]);

  return (
    <>
      {/* Animated gradient placeholder while loading - Darker gradient */}
      {!isLoaded && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-off-black to-darker-card-bg" 
          animate={{
            background: [
              "linear-gradient(to bottom, hsl(var(--background)), hsl(var(--card)))",
              "linear-gradient(to bottom, hsl(var(--card)), hsl(var(--background)))",
              "linear-gradient(to bottom, hsl(var(--background)), hsl(var(--card)))",
            ]
          }}
          transition={{
            duration: 10, // Slower transition
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}
      
      {/* Animated background image - Very subtle opacity for dark theme */}
      <motion.div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isLoaded ? 'opacity-[0.03] dark:opacity-[0.04]' : 'opacity-0'}`} // Much lower opacity
        style={{ backgroundImage: isLoaded ? `url('${imageUrl}')` : 'none' }}
        initial={{ scale: 1.02 }} // Slightly less zoom
        animate={isLoaded ? { scale: 1 } : {}}
        transition={{ duration: 15, ease: "linear" }} // Slower, linear animation
      />
      
      {/* Floating particles effect - Using Cool Lilac and Sky Blue Tint */}
      {isLoaded && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => ( // Fewer particles
            <motion.div
              key={i}
              className="absolute w-1 h-1 md:w-[3px] md:h-[3px] rounded-full" // Slightly smaller particles
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.1, // Lower opacity
                // Particles alternate between Cool Lilac and Sky Blue Tint
                backgroundColor: i % 2 === 0 ? 'hsl(var(--secondary))' : 'hsl(var(--primary))', // Using HSL vars
              }}
              animate={{
                y: [0, -(Math.random() * 150 + 70)], // More vertical movement
                opacity: [Math.random() * 0.2 + 0.05, 0], // Fade out more
                scale: [1, Math.random() * 0.5 + 0.5] // Less scaling
              }}
              transition={{
                duration: Math.random() * 15 + 15, // Slower duration
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear", // Linear movement
                delay: Math.random() * 8
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default BackgroundImage;
