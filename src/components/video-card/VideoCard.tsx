
import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format, isPast } from 'date-fns';
import { Card } from '@/components/ui/card';
import VideoThumbnail from './VideoThumbnail';
import PromptPopover from './PromptPopover';
import { VideoCardProps } from './types';
import { FileX } from 'lucide-react';

const VideoCard = ({ video, index }: VideoCardProps) => {
  const [isExpired, setIsExpired] = useState(false);
  
  // Check if video is expired based on created_at + 7 days (default expiry)
  useEffect(() => {
    if (video.expiryTime) {
      setIsExpired(isPast(new Date(video.expiryTime)));
    } else if (video.created_at) {
      // Fallback: check if it's older than 7 days
      const expiryDate = new Date(video.created_at);
      expiryDate.setDate(expiryDate.getDate() + 7);
      setIsExpired(isPast(expiryDate));
    }
  }, [video.created_at, video.expiryTime]);
  
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
  
  const formattedDate = video.created_at
    ? format(new Date(video.created_at), 'MMM d, yyyy')
    : 'Unknown date';
  
  const truncatedPrompt = video.prompt.length > 25
    ? `${video.prompt.substring(0, 25)}...`
    : video.prompt;
    
  // Use an embedded SVG data URL as fallback to ensure it always works
  const fallbackThumbnail = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjExMzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzRiNTU2MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlZpZGVvPC90ZXh0Pjwvc3ZnPg==';
  const thumbnailUrl = video.thumbnail || fallbackThumbnail;

  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg group">
        {isExpired ? (
          <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <div className="text-center p-4">
              <FileX className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Video has expired</p>
            </div>
          </div>
        ) : (
          <VideoThumbnail 
            thumbnail={thumbnailUrl}
            title={video.title || video.prompt}
            url={video.url}
          />
        )}
        
        <div className="p-3 flex-grow flex flex-col justify-between">
          <PromptPopover 
            prompt={video.prompt}
            truncatedPrompt={truncatedPrompt}
          />
          
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-muted-foreground">
              {formattedDate}
            </div>
            {isExpired && (
              <span className="text-xs text-red-500">Expired</span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default memo(VideoCard);
