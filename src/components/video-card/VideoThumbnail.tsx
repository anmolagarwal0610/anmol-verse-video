
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface VideoThumbnailProps {
  thumbnail: string;
  title: string;
  url: string;
}

const VideoThumbnail = ({ thumbnail, title, url }: VideoThumbnailProps) => {
  return (
    <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-full object-cover"
      />
      
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
