
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BackgroundImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  // Updated image URL
  const imageUrl = 'https://api.together.ai/imgproxy/0UUYuA512Vne9VjDy80EX3-P2-v5CLvlvni341YPVjE/format:png/aHR0cHM6Ly90b2dldGhlci1haS1iZmwtaW1hZ2VzLXByb2QuczMudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vaW1hZ2VzLzFhNGE5ZGQzMTkxMzI2Y2ZjZGYyZGQ3Yzc3ODEwZjM1NzBmMTZhNGMzZDQwMDU0YjIwY2NlOWRlMTQ0ODUwYzc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ29udGVudC1TaGEyNTY9VU5TSUdORUQtUEFZTE9BRCZYLUFtei1DcmVkZW50aWFsPUFTSUFZV1pXNEhWQ0VLQUVWN0VZJTJGMjAyNTA1MjElMkZ1cy13ZXN0LTIlMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNTIxVDExMTIwOFomWC1BbXotRXhwaXJlcz0zNjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPUlRb0piM0pwWjJsdVgyVmpFQU1hQ1hWekxYZGxjM1F0TWlKR01FUUNJRGp6dGV3OUdsYm82ZW01JTJCcFNvM0MwZFNKUlhkeGhDVW41SHBnN21tb2hiQWlBVHNocGozaGZzeUdvdnpWY0duWXJlRktvcURLS2oyc25DaFVBT1E5SDdreXFaQlFpOCUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRjhCRUFBYUREVTVPRGN5TmpFMk16YzRNQ0lNVWluR2s5aFFMJTJCUzFXRkRFS3UwRVRSYVdWdEZwWWxSUG15JTJGNVVSNHVzNWtEVXJweHRvcHRackhUdXBIVmtBczY0MnRDVVdEbExkOE9HRmlSOFVjJTJGS0hXcVFycVVwSjBJZGVVN2tiTGdMak50aUlqVjZoREp2MXhTaXAzd09Vbm1kb25jc3R5WXpITk1tS1pPd0o3WGlXQk96YzhzWm9jSzRxUUgyUFJJbnNZdXhIV2hzMHptJTJCR0ZQbFdrVnV0dHZ6bXNCU2E5d2V2RkE3R3J5OVZDRER4NDBnNyUyRmpZM3kzNFBJQU5qTFNaVVYwJTJGQW5sNTR1T0swZnhIOTZyOWhOeHJ2TjAzamNiWGZpdWJ3MmFTcFByd2FSYmFkQVJIb1QxcnkxcFEzNXJOWEpSTFY5R0trR1Nub0JSM2NRRHI4YW9DU1ZKNTVKJTJCQXJyYlpQNGklMkZ4NTZkZml4aTByNU10QktES3pFSUlicEFkR0VydDUycG5jJTJCJTJGMCUyQjMlMkZleEw1M1JCaEJPYkV3dnhHckhUd3pKSUlETEI4YXF4bkQlMkZSVFFHTlE4N3RLYm1JY2dZcUZwYmhSQkRCcEZpa2VLODhvUU8lMkJDZG1Id1g0cmxOUWtIQmtXWmFSMldvMkp6Y0lIb042Y1BSdnQxQTR0NnlTc1lhR0VnczdPZnVnJTJGTXFjcnRjeWR2YWZwaGV4TyUyQklPZW1sZzZCOWJCNHJOY25OQTNWM1I5dTNPVGhzMWU1Rm43RlpYOGNmRlpmbUtkbGp5NDM0WFNocjMlMkZ4OXlHVHAwYzdkbnJnRWxzUG9aRDYlMkJRSk0lMkY0STkzQUNNaFdDblpzdU1OaHFRRWtremslMkJRekZXJTJCeWw5Y21RRHVXZSUyRlklMkY2NHgwZDRVNVdQbUt0aHc5RlVIT3klMkYxWlBNSTR2VlViT1E5Qlh6WG1RbEUwUlp5aSUyRlEyT0FtenBCRFV6cHpQSFNTcUNGSWpwcmJ0NTZ1U2Vzb01WN3Vqck5KNjBOeXhabGtqUWlUbWIwSTkxeGdmSENJbnJUVVdETVhWeW1JYkVmRE5BWFVNemh2YXBCUFglMkZjTXJPYWQ3U1hGMm51TlJqdFNDRlowMlF0QWUwJTJGMEhRQVlPTTlqT1d1RjJmNmo0WmhOSkpuQkZNSWpxdHNFR09wd0JWQU5BOVI3N1g4Qzgybmt6d1pPVW4xYTlNTGdRQlUwcmZ5eWdybUxPbHI5aGU4M25oSVpLTjl1TDFzVHVZSHUlMkZFYjAyenVnS2olMkY0RzdoZXAzQTl2dW14TmREQktDcXFNaHk2VTJId0NJV1pOSHV5N2tqWlFkUnNDZ3RuMkJnQ0w4UTBKSWcyN2JIbUExNjVFTXpCcGRKVHVZZ1k5YlV6RUZuWEFZN1NaSGpLVlZiWkpQNGJVa0UzQmk4bG5XZ1hXZ0gzWnlNTkE1RDJHY3Z6TCZYLUFtei1TaWduYXR1cmU9MTk0MzIwZmU1OGVkODc0NzM3MjczMzczNTE5MWRmYmViNzYyMzVkYWVmMDkzYThmOTg5NTFjYTM3MGM2M2U0ZSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmeC1pZD1HZXRPYmplY3Q'; // Clear Glass Roof

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
