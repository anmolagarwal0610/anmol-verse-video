import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BackgroundImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageUrl = 'https://api.together.ai/imgproxy/gDwIlloGRUdrWr_LWaYG69A_xrVGY-UfA9JSvggR33Q/format:png/aHR0cHM6Ly90b2dldGhlci1haS1iZmwtaW1hZ2VzLXByb2QuczMudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vaW1hZ2VzLzc0MGFhZmI1OGQ1ZjgxZDIxZGE5NWZjZTEzYTI2MjljNzc5MDQzMmE5YjFkNGJmZThiYmU3NzMxY2E0NTkzOTA_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ29udGVudC1TaGEyNTY9VU5TSUdORUQtUEFZTE9BRCZYLUFtei1DcmVkZW50aWFsPUFTSUFZV1pXNEhWQ0FIRlhGTTRaJTJGMjAyNTA1MjElMkZ1cy13ZXN0LTIlMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNTIxVDEyNTM0N1omWC1BbXotRXhwaXJlcz0zNjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPUlRb0piM0pwWjJsdVgyVmpFQVVhQ1hWekxYZGxjM1F0TWlKSE1FVUNJUURLTlVWaHQ1bWRhRWUlMkZvWUtYa01ocWJCR09IUlJrdkR1V0pQS1RiYlVwandJZ0U3V1RuVEpZbUN5STVRYkJVZGhEdDVDRTYlMkIlMkZQUGpINjZyVGN6d1J3SEs0cW1RVUl2diUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRkFSQUFHZ3cxT1RnM01qWXhOak0zT0RBaURDRW1oaFhHRlNZJTJGWSUyRlF4QXlydEJKb2xTRGFxZW1SZ24xUzZ3d1JtdmozUjdqSmQ1ODJwS05wQklUemJyeFpNdHJMNTFTbFBGMEo0eEF2dVM3ajhQTGFPUUxLR2xpdVF6eHNCZ1BmRUlLZ1dmJTJCMERjQmN3Vk5mRVFlNUNwMm5hS0JEeUNKb05LdFRSckolMkI4V1p5UXkzT1BKS3BOQWhLdW5iMW9XcjNUcmVraWZBM1Z1d1B4QktYZlFUYyUyQkhwb2RrcTl6cExndGtseENmcyUyQkZjVCUyRm1ROHhJbm5WY2ZUNFE4VG8zbUdJdmNQSk5qJTJCNkZKZ3NnWldvMHFLb3BTVURvR3ZrVmhYcGxBbnkwZEsxVlVLcVpnOEVPYVg1cjJ4dGN1eUQyJTJCYkVub1Nyd3dPTnFDUCUyRkZrbDN2N0h6eWlJTTZQQ28lMkJ0VSUyQnJjVWdFNDdNamlwV0o3bHNRSFhmcHdoS3pEaTgyODNJN0hDVnNZV3VQaVU3YU9TMWlQaDdiUm8lMkI1YkdwWkhtZUQlMkZMUTVZM01wNTVWV3IlMkZqVmk3JTJCaUNYelpxZkFaUGtySW9TRkx2RnduR095eDZqa1BjVHhaUFZDUjJWbmVuSnk0eWUyeHZlZzZaUDVrT2hMR1ZnTjdwekZKY0lyV3E2JTJGaWRyRUVwdmNOcG9ycmZBUHNHN0h0VVhqRG16NzMyWkFUUWJmWSUyQlV4UnZuUkNyJTJCOUtwZHF1RlhFbU81OXFpYUJlT3pYM3o3ME5IeDZPYkkxelFlMURZY3AzTjE1RHN0MTBKZkxyT28wWjI1ZmQxMzZoR3VsNEdaa01aWGZNVUI1SHNGeVpXajNUUEFrdm8yMG9zc1ZwdjI1Vjg0ZkpKcDJVbkZKREZLWTQxWThzQTh5QXJIU0F1ODZWTUtYOVlYUkx4TW5VeW9zb1AyeUxqRVJ1am1yWmNJUkE2N21nUkNTSkVLSEZHTzUlMkJxdmNHN1gzVmRHV3U0djhGY3A4NWxoQkk3ZFdFYk9DQjF0bG8wS1VCeEdYZHNhM2U1Y1NFbVd0bDVmQXppakJtM0I4WSUyQnVsUHIyJTJGc2F0MGNKbHNDWm9qb29KTkpXVHVYbndHUXo4JTJGNkF0QzZ1M3ZjWURmMVZxeTR4MiUyRmxQb1BpWWpEYm1iZkJCanFiQVJhRnYzJTJGTkR6b3A2UUFHcXJqRnpUOEFEYnRqQ3ZSa3VQUzQ2c09hM1QwNWRKJTJGMFZSQTJGam56dWZYSyUyQnZyQUJnMUdEREpLZWxsTyUyQjBhcThTeGVZNmZVYjZkZlBnZTlqbkc0NEc4ZngyalIlMkZXNTZmekxvY0lsYTFMV0hmZUxMTU1zSWJSSmtxa1lsaiUyQjN1ZGFNWjdvSlJIYjRPeXZZQ1VTV2ZJa1hQWTdvMHpFc01jZlNCTm54RENReVhJTHZMOFp0RXlMY01aYXNPMHZ3YiZYLUFtei1TaWduYXR1cmU9NWEyM2ZmNjA4OTc5ZGJiNjhiY2NmNjgzZmE5OWE2MmU4ZjQwMWRkNTA0M2FmOGEzNjk3NzFmZmE2Y2M0ZGY3YSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmeC1pZD1HZXRPYmplY3Q'; // Abstract dark tech background

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
