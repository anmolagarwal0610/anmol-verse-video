import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BackgroundImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageUrl = 'https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1920'; // Abstract dark tech background

  useEffect(() => {
    console.log('BackgroundImage: Starting to load image');
    const startTime = performance.now();
    
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const endTime = performance.now();
      console.log(`BackgroundImage: Image loaded in ${endTime - startTime}ms`);
      setIsLoaded(true);
    };
    
    img.onerror = (e) => {
      console.error('BackgroundImage: Failed to load image:', e);
      setIsLoaded(true); // Show fallback or just proceed
    };
  }, [imageUrl]); // Added imageUrl to dependency array

  return (
    <>
      {/* Animated gradient placeholder using theme background colors */}
      {!isLoaded && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"
          animate={{
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      )}
      
      {/* Animated background image with very low opacity for subtlety */}
      {/* Changed opacity: light mode opacity-[0.01], dark mode opacity-[0.08] */}
      {/* Changed transition duration: from 10s to 3s */}
      <motion.div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isLoaded ? 'opacity-[0.01] dark:opacity-[0.08]' : 'opacity-0'}`}
        style={{ backgroundImage: isLoaded ? `url('${imageUrl}')` : 'none' }}
        initial={{ scale: 1.05, opacity: 0 }}
        animate={isLoaded ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 3, ease: "easeOut" }} // Shortened duration
      />
      
      {/* Floating particles effect - Using theme primary and accent colors */}
      {isLoaded && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 md:w-1.5 md:h-1.5 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.4 + 0.1,
                backgroundColor: i % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--accent))'
              }}
              animate={{
                y: [0, -(Math.random() * 150 + 70)], 
                x: [0, (Math.random() - 0.5) * 50], 
                opacity: [Math.random() * 0.3 + 0.2, 0, Math.random() * 0.3 + 0.2],
                scale: [1, Math.random() * 0.5 + 0.5, 1]
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                delay: Math.random() * 8
              }}
            />
          ))}
        </div>
      )}
      {/* Optional: Add a very subtle noise overlay */}
      {/* Consider making noise overlay opacity theme-dependent if still an issue: e.g., opacity-[0.005] dark:opacity-[0.015] */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
      />
    </>
  );
};

export default BackgroundImage;
