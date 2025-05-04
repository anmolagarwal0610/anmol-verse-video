
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
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  alwaysShowDelete?: boolean;
}

const ImageCard = ({ image, index, onLoad, onError, onDelete, alwaysShowDelete = false }: ImageCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { user } = useAuth();
  
  const isOwner = user && image.user_id === user.id;
  // Only show delete buttons for images owned by the user (not for default gallery images)
  const showDelete = isOwner || (alwaysShowDelete && user);

  // Handle image load/error events
  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError();
  };

  const handleOpenInNewTab = () => {
    // Use CORS proxy for opening the image in a new tab
    import('@/lib/utils/corsProxy').then(({ fetchWithCorsProxy }) => {
      // Just construct the URL with the proxy but don't fetch yet
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(image.image_url)}`;
      
      try {
        window.open(proxyUrl, '_blank');
        toast.success('Image opened in new tab');
      } catch (error) {
        console.error('Error opening image:', error);
        toast.error('Failed to open image. Please try again.');
      }
    });
  };

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg">
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

          {/* Always show action buttons for all images */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
            <Button 
              variant="ghost"
              size="icon"
              className="bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={handleOpenInNewTab}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            
            {showDelete && (
              <ImageDeleteButton 
                imageId={image.id}
                variant="overlay"
                onDelete={onDelete}
              />
            )}
          </div>
        </div>

        <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <ImagePromptPopover prompt={image.prompt} />
            
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

          <div className="flex justify-between items-center mt-2">
            <ImageMetadata 
              createdAt={image.created_at}
              expiryTime={image.expiry_time}
            />
            
            {/* Always visible button row at the bottom */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleOpenInNewTab}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open</span>
              </Button>
              
              {showDelete && (
                <ImageDeleteButton 
                  imageId={image.id}
                  variant="standalone"
                  onDelete={onDelete}
                />
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ImageCard;
