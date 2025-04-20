
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import ImagePromptPopover from '@/components/image-card/ImagePromptPopover';
import ImageDeleteButton from '@/components/image-card/ImageDeleteButton';
import ImageLoadingOverlay from '@/components/image-card/ImageLoadingOverlay';
import ImageMetadata from '@/components/image-card/ImageMetadata';
import ImageDownloadButton from '@/components/image-card/ImageDownloadButton';
import { GeneratedImage } from '@/components/gallery/GalleryTypes';
import { AlertTriangle } from 'lucide-react';

interface ImageCardProps {
  image: GeneratedImage;
  index: number;
  onLoad?: () => void;
  onError?: () => void;
  onDelete?: () => void;
  alwaysShowDelete?: boolean;
}

const ImageCard = ({ 
  image, 
  index, 
  onLoad, 
  onError,
  onDelete,
  alwaysShowDelete = false
}: ImageCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const handleImageLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };
  
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError();
  };
  
  // Calculate time until expiry
  const timeUntilExpiry = formatDistanceToNow(new Date(image.expiry_time), { addSuffix: true });
  const isNearExpiry = new Date(image.expiry_time).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000; // 7 days
  
  // Reset loading state when image URL changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [image.image_url]);

  return (
    <motion.div 
      className="relative group overflow-hidden rounded-lg shadow-md bg-slate-100 dark:bg-slate-800 aspect-square"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image */}
      {image.image_url && !hasError && (
        <img
          src={image.image_url}
          alt={image.prompt || 'Generated image'}
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
      
      {/* Loading state */}
      {isLoading && <ImageLoadingOverlay isLoading={true} />}
      
      {/* Expiry Warning */}
      {isNearExpiry && (
        <div className="absolute top-2 left-2 bg-yellow-500/90 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          <span>Expires {timeUntilExpiry}</span>
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Image failed to load
            </p>
          </div>
        </div>
      )}

      {/* Image actions */}
      <div 
        className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent ${hasError ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300 flex justify-between items-end`}
      >
        <ImagePromptPopover prompt={image.prompt} />
        <div className="flex space-x-2">
          {!hasError && <ImageDownloadButton imageUrl={image.image_url || ''} variant="overlay" />}
          <ImageDeleteButton 
            imageId={image.id} 
            onDelete={onDelete} 
            variant="overlay"
          />
        </div>
      </div>
      
      {/* Metadata */}
      <ImageMetadata 
        createdAt={image.created_at}
        expiryTime={image.expiry_time}
        preferences={image.preferences}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" 
      />
    </motion.div>
  );
};

export default ImageCard;
