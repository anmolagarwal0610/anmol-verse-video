
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import ImagePromptPopover from '@/components/image-card/ImagePromptPopover';
import ImageDeleteButton from '@/components/image-card/ImageDeleteButton';
import ImageLoadingOverlay from '@/components/image-card/ImageLoadingOverlay';
import ImageMetadata from '@/components/image-card/ImageMetadata';
import ImageDownloadButton from '@/components/image-card/ImageDownloadButton';
import { GeneratedImage } from '@/components/gallery/GalleryTypes';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
      className="relative group overflow-hidden rounded-lg shadow-md bg-white dark:bg-slate-800 flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        {/* Image */}
        {image.image_url && !hasError && (
          <img
            src={image.image_url}
            alt={image.prompt || 'Generated image'}
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        {/* Loading state */}
        {isLoading && <ImageLoadingOverlay isLoading={true} />}
        
        {/* Expiry Warning */}
        {isNearExpiry && (
          <div className="absolute top-2 left-2 bg-yellow-500/90 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 z-10">
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

        {/* Image actions - only visible on hover */}
        <div 
          className={`absolute inset-0 bg-black/30 flex items-center justify-center gap-3 
            ${hasError ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
            transition-opacity duration-300`}
        >
          {!hasError && (
            <>
              <ImageDownloadButton imageUrl={image.image_url || ''} variant="overlay" />
              <ImageDeleteButton 
                imageId={image.id} 
                onDelete={onDelete} 
                variant="overlay"
              />
            </>
          )}
        </div>
      </div>
      
      {/* Content below image */}
      <div className="p-4 flex flex-col gap-3">
        {/* Prompt */}
        <div>
          <ImagePromptPopover prompt={image.prompt} />
        </div>
        
        {/* Preferences/Tags */}
        {image.preferences && image.preferences.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {image.preferences.map((pref, i) => (
              <Badge 
                key={i} 
                variant="secondary" 
                className="text-xs font-normal"
              >
                {pref}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Metadata at bottom */}
        <ImageMetadata 
          createdAt={image.created_at}
          expiryTime={image.expiry_time}
        />
      </div>
    </motion.div>
  );
};

export default ImageCard;
