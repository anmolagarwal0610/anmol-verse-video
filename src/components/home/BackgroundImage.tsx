
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BackgroundImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  // Updated image URL
  const imageUrl = 'https://api.together.ai/imgproxy/hNNk0r403MYO2_x2d2mP0yMzXuDbPLu002l22mE3DBI/format:png/aHR0cHM6Ly90b2dldGhlci1haS1iZmwtaW1hZ2VzLXByb2QuczMudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vaW1hZ2VzLzkzZjY2Y2IyMjY5MjQwN2QwZDQzY2QxYTA5N2JlN2VlZTgyNTYzNDY5NDQ5NzNjMGI1OTk0OGM0ODU5NjVhZTk_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ29udGVudC1TaGEyNTY9VU5TSUdORUQtUEFZTE9BRCZYLUFtei1DcmVkZW50aWFsPUFTSUFZV1pXNEhWQ09EQ0hTNFpEJTJGMjAyNTA1MjElMkZ1cy13ZXN0LTIlMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNTIxVDEwMjg0OVomWC1BbXotRXhwaXJlcz0zNjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPUlRb0piM0pwWjJsdVgyVmpFQU1hQ1hWekxYZGxjM1F0TWlKSE1FVUNJUURodXJMMTBIMnJud3JLekphcHp3UG5yRlp1eGFJVjdRZ2dkSXVTYUxWWFBBSWdIMEl5Q2tXRWtIMWdpNXA4ZHozc3ZBelZWUUpBdzA2OXMycVhsVlcxT3VBcW1RVUl2UCUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRiUyRkFSQUFHZ3cxT1RnM01qWXhOak0zT0RBaURCUjQyNkxsOCUyRjlMd3JtM3VDcnRCRXVkWFolMkZlJTJCMmNpaldHMUtvVXh5SGJnTGNvSkJvWGpvOWU1UFk3RiUyRk5xZkVwc3RmOSUyQiUyQnBRQ2EwV2JIJTJCWTB5c0JsQXZKOFBrMU95S1QlMkIwcG91WVNSbmhOZDBzb1FsVTQydEpQdUt0UXJjSVNGV1ZrTlcwR1FYSmYlMkJaQzB3aTNCbERRNUJ6YVE4RmZNMlZKbXRDeXk3eCUyRlEwbnpCSWtlcVhvZyUyRm81VnFCUVklMkZ1NUp5SjlqRWtzbDQ4NENwWnl3WXdaRnNreEJuJTJCWW1Malo2Um1Ib2htOXk3SURxQWVGRFBkemQ4SkVVJTJCNFgyalh3aUhLRmMxQVJTVHhMTWZ3SGRDOGRiS01sTlRVcWhweiUyQjVuak50SVhhUjVnMm5jMmVDVSUyRlJvOVc3VW1LY2lodzglMkZYMmxLdUglMkZidDZ2NWlrVWpPaU5oY2d5akFSUnBxWnRveGhIbTlHUnNjT01hSiUyRmxRMk9CUEZod2VVRmU1Q2pOWEd6VUx2YVY3RmlTZVlhOXclMkZtUTljUVc1QURzSnNnMDlPeWJJcDNoSEFxOTBodTQ3Y05kckliWjlFR0V1SUlvYnloeFNVTTJaV0I2aTJ0QUJoSjQlMkIzTkF3ZlZFWlFzZW5yaWJtMVlsWSUyRkl5aVJDZWdyTnlzUVNndFZVWk43U2szOUVWNmdPcGptcjA3TlhEJTJCa1h5NDZ4S09Ca0RmVXN2dFFoYVN4ejc0c0JwcldaMUNrUGpVbmNtaW93OTJob0NZUyUyRjd1JTJCRlklMkZXN0JDc2s0Z1BLdXZSNVk1SVhlT3hDb25ZSlZ4aXhDZk8lMkJYb2NEQ3FBcmpNYlJCRzhHQTVpUGVNcm84b3B3Z3pXRzZXV3JXUENCQkwlMkJ5S0M3ZGVnayUyQktWTWtqWFRHMVVaM0Nic3d5aTFXSkxsd2pHJTJCclZlcUlFeTRab0dvS01KbTRMRDJIZHhFTkVTVVhraFhhMng5eVJRanVYd0FYNVJLaDAyUUdzRFlQSzlJU20lMkZhWDl2VU9GNkFqTWx0MTZCZUJKaFAxR2NVckU1WnZtQmg0UzJsOGtQMzBMeldjb201RnRWRTdUY05GJTJCajFEeXpuOSUyQiUyRmtCbEQxMkhzTThacG9zTDFXekRnMWJiQkJqcWJBY0pWdEhaQjdEcHNZVlJVRVNvTnNzWVBGVzg0OEZ5b1gwaWlQMmI1TFltVFU2NnU2bk1Kdk1JcFVBRVZ5QkM3VzhEYktybHh4bFNRanh1MDJUdDJhNUtqNk16JTJGd0pnbzVoaldqZnFJcFklMkJ4eDdtSiUyQkx2dWdNVEx1aGt4TGt5MU56Q0Q0aTRlVkdJYTJUdlk4ME5IRGI4czklMkJZQWMyUEhaWktLU1NpbUpkRXR1SERpYzQ1SDVQbHRBZjl5YlpKY0ZRTVpRWEhJSFBrb0xlMnkmWC1BbXotU2lnbmF0dXJlPWZhN2JmYTk0NGQyZjJiN2NiZWU4MDk5OGFlMWEyNjJlNzdmZjYxM2JhYzc0NjE0YWUzNGFkN2M3OWE0MTBhODcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JngtaWQ9R2V0T2JqZWN0'; // Clear Glass Roof

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
