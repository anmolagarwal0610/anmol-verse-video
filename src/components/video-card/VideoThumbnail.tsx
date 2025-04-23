
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface VideoThumbnailProps {
  thumbnail: string;
  title: string;
  url: string;
}

const VideoThumbnail = ({ thumbnail, title, url }: VideoThumbnailProps) => {
  const [imgSrc, setImgSrc] = useState<string>(thumbnail || '');
  const [imgError, setImgError] = useState<boolean>(!thumbnail);
  
  // Log the initial thumbnail URL
  useEffect(() => {
    console.log(`VideoThumbnail: Rendering with thumbnail URL:`, {
      url: thumbnail,
      fallback: !thumbnail ? 'No thumbnail provided, using fallback' : 
               thumbnail.includes('placeholder') ? 'Using placeholder' : 'Using actual thumbnail',
      isValid: Boolean(thumbnail && thumbnail.startsWith('http'))
    });
    
    // Check if thumbnail is null or invalid and set error state immediately
    if (!thumbnail || !thumbnail.startsWith('http')) {
      console.log('VideoThumbnail: Invalid or null thumbnail detected, using fallback');
      setImgError(true);
      // Use a reliable placeholder service
      setImgSrc('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjExMzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzRiNTU2MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlZpZGVvPC90ZXh0Pjwvc3ZnPg==');
    }
  }, [thumbnail]);
  
  const handleImageError = () => {
    console.error(`VideoThumbnail: Failed to load image from URL:`, thumbnail);
    setImgError(true);
    // Use a data URL SVG placeholder that's guaranteed to work
    setImgSrc('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjExMzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzRiNTU2MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlZpZGVvPC90ZXh0Pjwvc3ZnPg==');
  };
  
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Important: DO NOT modify double slashes in URLs as they may be intentional
    // Just validate that the URL starts with http/https
    if (!url || !url.startsWith('http')) {
      console.error('VideoThumbnail: Invalid video URL:', url);
      toast.error('Sorry, this video cannot be played. The URL is invalid.');
      return;
    }
    
    console.log('VideoThumbnail: Opening video URL:', url);
    
    // Open in a new tab as a reliable way to play the video
    window.open(url, '_blank');
  };
  
  return (
    <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
      {imgError ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-700 dark:bg-gray-800">
          <p className="text-sm text-center p-4 text-gray-200">Video Preview</p>
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
          onClick={handlePlayClick}
        >
          <Play className="h-8 w-8 text-white" />
        </Button>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default VideoThumbnail;
