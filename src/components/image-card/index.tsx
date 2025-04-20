
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import ImageLoadingOverlay from './ImageLoadingOverlay';
import ImageDownloadButton from './ImageDownloadButton';
import ImagePromptPopover from './ImagePromptPopover';
import ImageMetadata from './ImageMetadata';
import ImageDeleteButton from './ImageDeleteButton';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';

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
  expiry_time: string;
}

interface ImageCardProps {
  image: ImageData;
  index: number;
  onLoad?: () => void;
  onError?: () => void;
  onDelete?: () => void;
}

const ImageCard = ({ image, index, onLoad, onError, onDelete }: ImageCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();
  
  const isOwner = user && image.user_id === user.id;
  
  useEffect(() => {
    if (image.image_url) {
      setHasError(false);
      setIsLoading(true);
    }
  }, [image.image_url]);
  
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
    
    if (retryCount === 0 && image.image_url) {
      setRetryCount(1);
    } else if (onError) {
      onError();
    }
  };

  const imageUrl = retryCount > 0 && image.image_url 
    ? `${image.image_url}${image.image_url.includes('?') ? '&' : '?'}cache=${Date.now()}`
    : image.image_url;

  return (
    <motion.div
      className="h-full"
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg">
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
              src={imageUrl}
              alt={image.prompt}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
            />
          )}
          
          {/* Action buttons overlay - only visible on hover */}
          {!hasError && (
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <ImageDownloadButton 
                imageUrl={image.image_url}
                variant="overlay"
              />
              {isOwner && (
                <ImageDeleteButton 
                  imageId={image.id}
                  variant="overlay"
                  onDelete={onDelete}
                />
              )}
            </div>
          )}
        </div>
        
        {/* Content below image */}
        <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
          {/* Prompt section */}
          <div className="space-y-2">
            <ImagePromptPopover prompt={image.prompt} />
            <div className="flex flex-wrap gap-1">
              {image.preferences?.map((pref, i) => (
                <Badge 
                  key={i} 
                  variant="secondary" 
                  className="text-xs font-normal"
                >
                  {pref}
                </Badge>
              ))}
            </div>
          </div>

          {/* Metadata section */}
          <ImageMetadata 
            createdAt={image.created_at}
            expiryTime={image.expiry_time}
          />
        </div>
      </Card>
    </motion.div>
  );
};

export default ImageCard;
