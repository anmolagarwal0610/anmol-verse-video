
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
import { AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
  alwaysShowDelete?: boolean; // Added this prop
}

const ImageCard = ({ image, index, onLoad, onError, onDelete, alwaysShowDelete = false }: ImageCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { user } = useAuth();
  
  const isOwner = user && image.user_id === user.id;
  const timeUntilExpiry = formatDistanceToNow(new Date(image.expiry_time), { addSuffix: true });
  const isNearExpiry = new Date(image.expiry_time).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    if (image.image_url) {
      setHasError(false);
      setIsLoading(true);
    }
  }, [image.image_url]);

  const handleImageLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError();
  };

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg">
        {/* Image Container with Hover Actions */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 group">
          <ImageLoadingOverlay isLoading={isLoading} />
          
          {hasError ? (
            <div className="w-full h-full flex items-center justify-center">
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
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
            />
          )}

          {/* Expiry Warning */}
          {isNearExpiry && (
            <div className="absolute top-2 left-2 bg-yellow-500/90 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 z-10">
              <AlertTriangle className="h-3 w-3" />
              <span>Expires {timeUntilExpiry}</span>
            </div>
          )}

          {/* Hover Action Buttons */}
          {!hasError && (
            <div className={`absolute inset-0 bg-black/30 ${alwaysShowDelete ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200 flex items-center justify-center gap-2`}>
              <ImageDownloadButton 
                imageUrl={image.image_url}
                variant="overlay"
              />
              {(isOwner || alwaysShowDelete) && (
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
        <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
          {/* Prompt Section */}
          <div className="space-y-3">
            <ImagePromptPopover prompt={image.prompt} />
            
            {/* Preferences/Tags */}
            {image.preferences && image.preferences.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
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
          </div>

          {/* Metadata at bottom */}
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
