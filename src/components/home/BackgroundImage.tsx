
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BackgroundImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageUrl = 'https://api.together.ai/imgproxy/eBrSc9kEc8J5ckWBqEQ6x-ECrA1vMEw9WLaj8YLf818/format:png/aHR0cHM6Ly90b2dldGhlci1haS1iZmwtaW1hZ2VzLXByb2QuczMudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vaW1hZ2VzL2FiMTlkOTEzNjQ5NmY3NjRmYWIyYTY5OTEyMmYwNWJjZGI3MzQ2ZGRiODIxYTkzYjUzNDg0OTk3ZjI0MzU1YTI_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ29udGVudC1TaGEyNTY9VU5TSUdORUQtUEFZTE9BRCZYLUFtei1DcmVkZW50aWFsPUFTSUFZV1pXNEhWQ0gzR1BaR1U2JTJGMjAyNTA1MjElMkZ1cy13ZXN0LTIlMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNTIxVDExNTIxNFomWC1BbXotRXhwaXJlcz0zNjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPUlRb0piM0pwWjJsdVgyVmpFQVFhQ1hWekxYZGxjM1F0TWlKSE1FVUNJR3pIamhHRzhHSWFnd253YTRzQ3UlMkZEU0dxMlN2Y3RPJTJCRGppb1FEdEZ6JTJCbUFpRUE4SXVPMXlwZlJ3TkVlTW4lMkZubGJBeDJqUVNUM0lOJTJCbUslMkZSRDhlVzd3Y0FncW1RVUl2ZiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRkFSQUFHZ3cxT1RnM01qWXhOak0zT0RBaURETWtlY2d0QXh4Yzd5dVFIQ3J0Qkd4OU5BNGlpa3pOWkVmc093Y0pkemxCWTIyaFpuMW9MY2l0cWpXYnE3VHUlMkJCdkQxN1UwWFMxc0poMlVWSGl5TVBMeEJXdEoxa3psOG93aUJMMEdhVVolMkZkVFVZSkZSVko4SnZ5elZwM3dyazZ2REI0clA3REo2RVN1Wlp3QXZuMG5FYzVXenhMRHU2SndqbVlLOGo3V3Y3JTJCZjc4Q3ZXV09uSjZsYVFzOFpTNHhlNk5qT0hnQUNOVTJtZmw4cG1TWXBkMU9LRlJnUGhTSWxmV3BhUDRmUTdJJTJCcVFndjIlMkJCdjA1Qmt6aTg3S1VzRmM5WnhBcm9ISzZPRWhQd29paiUyRjg5U0hXY0FyVUhwS05CJTJGNFNrWVdCNEVYRjlBdXpJNTFSYTZSTURSaVVzQUFIWGNPSk1Ud3AyUUpaZU0lMkIyOFE5aW0lMkZaUVZva3J5ZEJBNGk0ZU1LbmlVQVF1UEFsRmMlMkZJTzA4ZFFsaEp0cjdJOE4lMkJFRDdjSFd0T0puS0QlMkJKR3J3YlozRlp3cDNvcmk3enRwJTJCUVRTYlNQdVp3UFAzJTJGaHhxcDRtJTJGcW9qV1JRTkZYbkdadWowbmkzVWJPZ0gxU09pJTJCZHRvRG5CNVR0VFFRTUVQMzdyb3NKU2ZsUW1DSFJlRmZBb3NwaW5NZ1JXRjJqTU5XcG5FWk5YZjRGQ1lsOFZxTGw2d0hnZDhqSjVja1JNVFUxOVglMkZlbk9jRTNEUGlIaDA1JTJCRXh5OExnRkFGcSUyRkR5NDhWcGg0VGJ5JTJCamNWZ2hCVUF4aVNEczd0SGpYdVN1R2ZVamx3b3lURkNoZnY5c3k1cEdVd1JLMWxxQlJCb0toeVZja1AlMkZ6NTM2bkxQRENaMnNmcHA4eGRXUk5qRFFDRDh4OUI3YzRuaFhYbG9XRHI0YTkyU0tlQU1mVU1SWjRiNzVSWjFTJTJCWFpyVm1ETUhITHBrUHRQSERuRkMlMkYlMkZCOUp3cEV6eTclMkJpZHdTaGdTUHklMkJTaTFGb0FPRXpHd2JKV210enRMcFZXQzNQbWZ5JTJCeE1pYU05aFVGazlCakROYVMyVE5waGhoY3F4SFdLeXAxZ2RmZzdPbWx1YTdsblh6bWUzNUhQJTJCMTBsZSUyRjRDbGp6RHUlMkZMYkJCanFiQWYlMkI3NlFIMFNaejR1SHlha3FVVTBPRGg4WURCcE5tY3VEcHFWSWwwbkc3YVdwZWFaeHRjRm9tYW01JTJGU21FeklUTm5MQkVSQ3pMZjgxUk5QN2NkJTJCUmt6UVF6Y3h1MGwxMElGc2tGYmo0RW03dHFPQXZ2bDltT1VKWU9CakJibUxzMnJWZDRWZzIlMkYlMkIlMkZzMHdLUXZHVW93TCUyRnRYSGxxMVliendPUmVHNk1jMnR0NFV2ZFlqeSUyQlZFWnFkWkpyNVJhTzYzSjBaSGtPWXc4TVpmcEsmWC1BbXotU2lnbmF0dXJlPTZkNmViY2I5ZmI2NmQzNGZlMjJiZTJkNWQ4MGVjNDAzYzRhMDRlNzFiNjdmODUyNDgwOTE3ZGRlODg1NDcyYTUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JngtaWQ9R2V0T2JqZWN0'; // Abstract dark tech background

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
      {/* Animated gradient placeholder: Darker, subtle gradient */}
      {!isLoaded && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--color-off-black))] via-[hsl(210,33%,8%)] to-[hsl(var(--color-off-black))]" // Off-Black to slightly different Off-Black
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
      <motion.div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isLoaded ? 'opacity-5 dark:opacity-10' : 'opacity-0'}`} // Very subtle
        style={{ backgroundImage: isLoaded ? `url('${imageUrl}')` : 'none' }}
        initial={{ scale: 1.05, opacity: 0 }}
        animate={isLoaded ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 10, ease: "easeOut" }}
      />
      
      {/* Floating particles effect - Light Cyan / Cool Lilac */}
      {isLoaded && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 md:w-1.5 md:h-1.5 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.4 + 0.1, // Slightly more visible
                // Mix of Cool Lilac and Light Cyan for particles
                backgroundColor: i % 2 === 0 ? 'hsl(var(--color-cool-lilac))' : 'hsl(var(--color-light-cyan))'
              }}
              animate={{
                y: [0, -(Math.random() * 150 + 70)], // Slower, longer travel
                x: [0, (Math.random() - 0.5) * 50], // Slight horizontal drift
                opacity: [Math.random() * 0.3 + 0.2, 0, Math.random() * 0.3 + 0.2],
                scale: [1, Math.random() * 0.5 + 0.5, 1]
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear", // Smoother, less jerky
                delay: Math.random() * 8
              }}
            />
          ))}
        </div>
      )}
      {/* Optional: Add a very subtle noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
      />
    </>
  );
};

export default BackgroundImage;
