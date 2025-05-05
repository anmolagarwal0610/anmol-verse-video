
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GeneratedImage } from './GalleryTypes';
import ImageCard from '@/components/image-card'; 
import { useAuth } from '@/hooks/use-auth';

interface GalleryImageGridProps {
  images: GeneratedImage[];
}

const GalleryImageGrid = ({ images: initialImages }: GalleryImageGridProps) => {
  const [images, setImages] = useState<GeneratedImage[]>(initialImages);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  
  useEffect(() => {
    // Update images when initialImages changes
    setImages(initialImages);
    // Reset loaded and failed states when images array changes
    setLoadedImages(new Set());
    setFailedImages(new Set());
  }, [initialImages]);
  
  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    
    // Remove from failed set if it was previously failed
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };
  
  const handleImageError = (id: string) => {
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };
  
  const handleImageDelete = (id: string) => {
    // Remove the image from the local state
    setImages(prev => prev.filter(image => image.id !== id));
    
    // Remove from loaded and failed sets
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {images.map((image, index) => (
        <div key={image.id} className="relative">
          <ImageCard 
            image={image} 
            index={index} 
            onLoad={() => handleImageLoad(image.id)}
            onError={() => handleImageError(image.id)}
            onDelete={() => handleImageDelete(image.id)}
            alwaysShowDelete={true} // Always show delete button
          />
        </div>
      ))}
    </motion.div>
  );
};

export default GalleryImageGrid;
