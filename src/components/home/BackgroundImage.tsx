
import { useEffect, useState } from 'react';

const BackgroundImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageUrl = 'https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=1200'; // Reduced quality

  useEffect(() => {
    // Preload the image
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setIsLoaded(true);
    };
  }, []);

  return (
    <>
      {/* Placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-indigo-900/20" />
      )}
      
      {/* Actual background image */}
      <div 
        className={`absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20 transition-opacity duration-300 ${isLoaded ? 'opacity-10' : 'opacity-0'}`}
        style={{ backgroundImage: isLoaded ? `url('${imageUrl}')` : 'none' }}
      />
    </>
  );
};

export default BackgroundImage;
