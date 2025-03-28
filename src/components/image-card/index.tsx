
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import ImageLoadingOverlay from './ImageLoadingOverlay';
import ImageDownloadButton from './ImageDownloadButton';
import ImagePromptPopover from './ImagePromptPopover';
import ImageMetadata from './ImageMetadata';

export interface ImageData {
  id: string;
  prompt: string;
  image_url: string;
  width: number;
  height: number;
  created_at: string;
  preferences?: string[];
  model: string;
  user_id?: string;
}

interface ImageCardProps {
  image: ImageData;
  index: number;
  onLoad?: () => void;
  onError?: () => void;
}

const ImageCard = ({ image, index, onLoad, onError }: ImageCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };
  
  const handleImageLoad = () => {
    console.log(`Image loaded successfully: ${image.id}`);
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${image.id} from URL: ${image.image_url.substring(0, 30)}...`);
    setIsLoading(false);
    setHasError(true);
    if (onError) onError();
  };

  return (
    <motion.div
      className="h-full"
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg group">
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          <ImageLoadingOverlay isLoading={isLoading} />
          
          {hasError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2 text-center">
                Unable to load image
              </p>
            </div>
          ) : (
            <img
              src={image.image_url}
              alt={image.prompt}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {!hasError && (
            <ImageDownloadButton 
              imageUrl={image.image_url}
              prompt={image.prompt}
              variant="overlay"
            />
          )}
        </div>
        
        <div className="p-3 flex-grow flex flex-col justify-between">
          <ImagePromptPopover prompt={image.prompt} />
          
          <ImageMetadata 
            createdAt={image.created_at}
            preferences={image.preferences}
          />
        </div>
      </Card>
    </motion.div>
  );
};

export default ImageCard;
