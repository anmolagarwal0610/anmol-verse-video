
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GeneratedImage } from './GalleryTypes';
import ImageCard from '@/components/image-card'; // Fixed import path

interface GalleryImageGridProps {
  images: GeneratedImage[];
}

const GalleryImageGrid = ({ images: initialImages }: GalleryImageGridProps) => {
  const [images, setImages] = useState<GeneratedImage[]>(initialImages);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    // Update images when initialImages changes
    setImages(initialImages);
    // Reset loaded and failed states when images array changes
    setLoadedImages(new Set());
    setFailedImages(new Set());
  }, [initialImages]);
  
  // Pre-validate all images when the component mounts or images change
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    console.log('GalleryImageGrid: Validating images on mount/update');
    
    const validateImages = async () => {
      // Only validate images that aren't already in our loaded or failed sets
      const imagesToValidate = images.filter(image => 
        !loadedImages.has(image.id) && !failedImages.has(image.id)
      );
      
      for (const image of imagesToValidate) {
        if (!image.image_url || !image.image_url.startsWith('http')) {
          console.warn('GalleryImageGrid: Invalid image URL for image ID:', image.id);
          setFailedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(image.id);
            return newSet;
          });
          continue;
        }
        
        // Since we don't want to block rendering with a lot of image validations,
        // we'll just do basic URL validation and let the ImageCard handle the actual loading
      }
    };
    
    validateImages();
  }, [images, loadedImages, failedImages]);
  
  const handleImageLoad = (id: string) => {
    console.log('GalleryImageGrid: Image loaded successfully:', id);
    
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
  
  const handleImageError = (id: string, url: string) => {
    console.error(`GalleryImageGrid: Failed to load image ${id} from URL: ${url.substring(0, 50)}...`);
    
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
  
  console.log(`GalleryImageGrid: Rendering with ${images.length} images`);
  console.log(`GalleryImageGrid: Loaded images: ${loadedImages.size}, Failed images: ${failedImages.size}`);

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {images.map((image, index) => {
        // Skip rendering completely invalid images (no URL)
        if (!image.image_url) {
          console.warn('GalleryImageGrid: Skipping image with no URL, ID:', image.id);
          return null;
        }
        
        return (
          <div key={image.id} className="relative">
            <ImageCard 
              image={{
                ...image,
                // Ensure image URL is valid
                image_url: image.image_url 
              }} 
              index={index} 
              onLoad={() => handleImageLoad(image.id)}
              onError={() => handleImageError(image.id, image.image_url || '')}
              onDelete={() => handleImageDelete(image.id)}
              alwaysShowDelete={failedImages.has(image.id)} // Always show delete button for failed images
            />
          </div>
        );
      })}
    </motion.div>
  );
};

export default GalleryImageGrid;
