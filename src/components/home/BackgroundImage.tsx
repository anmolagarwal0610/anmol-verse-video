
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BackgroundImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  // Updated image URL
  const imageUrl = 'https://api.together.ai/imgproxy/43uHe1_8Ehyad9kNSKYlhyQus_EL_Sk_wHEmfDsk1XY/format:png/aHR0cHM6Ly90b2dldGhlci1haS1iZmwtaW1hZ2VzLXByb2QuczMudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vaW1hZ2VzL2M3NWUwNDczMDJkMTExOTg3MDU3OWMyYzZjMzQxNjIyZDg3MzE4ZWZlY2YzZWIxMDcwM2MxMjlhMGM2ZDRlMWU_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ29udGVudC1TaGEyNTY9VU5TSUdORUQtUEFZTE9BRCZYLUFtei1DcmVkZW50aWFsPUFTSUFZV1pXNEhWQ09PS0M3UEYyJTJGMjAyNTA1MjElMkZ1cy13ZXN0LTIlMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNTIxVDEwNDcyNFomWC1BbXotRXhwaXJlcz0zNjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPUlRb0piM0pwWjJsdVgyVmpFQU1hQ1hWekxYZGxjM1F0TWlKR01FUUNJQkdyUm9KVjJROEE5UTJHbmE1Y2hMekRscFN6Y2xiRFVGaWo5Zkg1Z3J5NUFpQUw4a20lMkJIVVdIZERkZnQ0bTZJUHN0JTJGN3k4Ukl6UzBoRnZkMUg4aGRPbkdTcVpCUWk4JTJGJTJGJTJGJTJGJTJGJTJGJTJGJTJGJTJGJTJGOEJFQUFhRERVNU9EY3lOakUyTXpjNE1DSU1JR1hWallCUXo0RHhLVDlNS3UwRURVejk2b2NrdHlGWUFCejVHTVc4WXRDcnJEbURkZkg1TURvcGNtQ2wzV1lLbEV3Q3NPVHJJRWRFY3hjOTdiTlplSmFjRDhpR2ZFRWpSdlFmQUNmU24wOHl6SCUyQm8zdE1rSkx3WGF5OHY2UVN1cnhHNElGdXZaQkNtRFBVRTdRNnZ3Q1loeEZOcWl4YlRaR0RCcXhtamFaN01DR3B3WVpKeTFBdXdKdW5TSWRaeGJUU2FRTDFWeEE1RFElMkJ5TGdOdjVLdE9BV3prQmhiTmphM1NTd0VkcGhOVE44RndOZFZVWmJ6RndhZmJ2akY2T2dSNUlTd1B5YjEydzg5WVliR252MW9XeiUyQm9yZUVqZmp4dnhhNWlTZFFaY1AzdVB4a2wyOHpNNWFZOTR6TmpQRDlOeVRhZyUyRm1XakQ2Mmo4SjBlTWRDdUo3JTJGc0NLV2F4c0k1cFBpTVQ3VFhIZHBKRTFCM096UnJrQ0NQdTZ4eTgxUFE2Y1h3STJXSzU1SFZUdDNwUXVRRHhIU2V6SjE1MmFxRmdYUTRNM1FCakRFV1lDd2loSGVXQXZxMlZxM0d6bU1VMWJQcEdxZVBXTVFmS0pQRzZwenZnbERpWW5sbE41MWJFRmt3TVEyNXQxNUFDT3lwcjByNVQ1WmdQNjFSU0ZGODN3bWFGM1FaYlBlcGJHZkRCZ0xJQVZ1eTJWemtrb0R6ZHZTV0paWjBnZUFuNnNZQ04zbjJHeHolMkZjdm5XMXE0MWc1VEJJdnJRTU1oNG1DZTBUOVVMQUo2TGdvekljZUFFQ0hEanN4M1VZTlNpMXJiSFE5eEk0dDJiNWZJV2pKJTJGaUhzd0thZkpCYXdCRG1sMGlaVmxNVlpKMjJRcjZNcEdkVDhjQm9MbiUyRldKcGZTbUg0VldTa2hvN1QwQ2k3YiUyRkFHeG5vWiUyQjdxUVA2akdrUDFvJTJCN21yMmk4YkE2eSUyQjF6VHE1TWdTYU90RCUyRmVkRW05SVRIQiUyRlM0aUM3WWpTYTJFamZqSWolMkJydU55M0QwamtJZjV2UDdoaEQxcWhBZVFad1lLUXY5cDNyZDRqbllQd0ZRYWVTbyUyRmhQZFNQdWpLNzhkJTJCV2dWUmlrN3pBem8xT3RNTHpldHNFR09wd0JreTRWVTZ0SnNLQ2VmSzc2JTJCamdQJTJCT250b0N0SjJwb2wzb2R1QVdEeHpLdmdWWWxHNlV2ZkpqaVhzRDVlU05sJTJCYU5Tb1pzSVRRR05EUGdPRmhCa09xN0Y1Vm9WcmhzY0x2V2ZMUkNhM2VaUEVKU3l6bVZjdmJBM2dnREd5dyUyRiUyRlhJU2lTSnZXSVQ0aldYSE5YbWk2QVE5VUViOUZ5b1dHemUxWERGTUZkb1UwQmp3bXRBbHU3eFA3YlVHQXJhSUJnZEolMkJVVmx0WGpDTG1LQk9RJlgtQW16LVNpZ25hdHVyZT1hYjMzYTFhYWM5MmJjYWNjMDAzYTU0ZDUyMWVhNWI3MmY5YThiYzRmOGM1MTkyZGNiNzUzOThhMWU0N2VhMWJmJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ4LWlkPUdldE9iamVjdA'; // Clear Glass Roof

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
