
import React from 'react';

const BackgroundImage = () => {
  return (
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=2000')" }}
    />
  );
};

export default BackgroundImage;
