
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';

interface VideoThumbnailProps {
  thumbnail: string;
  title: string;
  url: string;
}

const VideoThumbnail = ({ thumbnail, title, url }: VideoThumbnailProps) => {
  const [imgSrc, setImgSrc] = useState<string>(thumbnail);
  const [imgError, setImgError] = useState<boolean>(false);
  
  // Log the initial thumbnail URL
  useEffect(() => {
    console.log(`VideoThumbnail: Rendering with thumbnail URL:`, {
      url: thumbnail,
      fallback: thumbnail?.includes('placeholder') ? 'Using placeholder' : 'Using actual thumbnail',
      isValid: Boolean(thumbnail && thumbnail.startsWith('http'))
    });
    
    // Check if thumbnail is null or invalid and set error state immediately
    if (!thumbnail || !thumbnail.startsWith('http')) {
      console.log('VideoThumbnail: Invalid thumbnail detected, using fallback');
      setImgError(true);
      setImgSrc('https://placehold.co/640x1136/gray/white?text=Video');
    }
  }, [thumbnail]);
  
  const handleImageError = () => {
    console.error(`VideoThumbnail: Failed to load image from URL:`, thumbnail);
    setImgError(true);
    // Use a different placeholder service that's more reliable
    setImgSrc('https://placehold.co/640x1136/gray/white?text=Video');
  };
  
  return (
    <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
      {imgError ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          <p className="text-sm text-center p-4">Video thumbnail unavailable</p>
        </div>
      ) : (
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      )}
      
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm" 
          asChild
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Play className="h-8 w-8 text-white" />
          </a>
        </Button>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default VideoThumbnail;
