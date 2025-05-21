import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BackgroundImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageUrl = 'https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1920'; // Clear Glass Roof

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
      {/* Animated gradient placeholder while loading - Darker Off-Black to subtle Cool Lilac */}
      {!isLoaded && (
        <motion.div 
          className="absolute inset-0" 
          style={{ background: 'rgb(var(--background-rgb))' }} // Solid Off-Black for loading
          animate={{
             opacity: [0.5, 0.7, 0.5] // Subtle pulse
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}
      
      {/* Animated background image - Adjusted opacity for dark theme */}
      <motion.div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isLoaded ? 'opacity-[0.03] dark:opacity-[0.04]' : 'opacity-0'}`} // Very subtle
        style={{ backgroundImage: isLoaded ? `url('${imageUrl}')` : 'none' }}
        initial={{ scale: 1.05 }}
        animate={isLoaded ? { scale: 1 } : {}}
        transition={{ duration: 10, ease: "easeOut" }}
      />
      
      {/* Floating particles effect - Sky Blue Tint */}
      {isLoaded && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 md:w-[3px] md:h-[3px] rounded-full bg-[#8EC5FC]" // Sky Blue Tint
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.2 + 0.05 // More subtle opacity
              }}
              animate={{
                y: [0, -(Math.random() * 200 + 100)], // Slower, longer travel
                x: [0, (Math.random() - 0.5) * 100], // Slight horizontal drift
                opacity: [Math.random() * 0.15 + 0.05, 0],
                scale: [1, Math.random() * 0.5 + 0.5]
              }}
              transition={{
                duration: Math.random() * 20 + 15, // Longer duration
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear", // Changed to linear for smoother constant drift
                delay: Math.random() * 10
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default BackgroundImage;
