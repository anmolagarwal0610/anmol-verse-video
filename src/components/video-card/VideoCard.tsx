
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import VideoThumbnail from './VideoThumbnail';
import PromptPopover from './PromptPopover';
import { VideoCardProps } from './types';
import { useEffect } from 'react';

const VideoCard = ({ video, index }: VideoCardProps) => {
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
    
  const fallbackThumbnail = 'https://placehold.co/640x1136/gray/white?text=Video';
  const thumbnailUrl = video.thumbnail || fallbackThumbnail;

  // Log video data when component mounts
  useEffect(() => {
    console.log(`VideoCard: Rendering video card:`, {
      id: video.id,
      title: video.title || video.prompt,
      thumbnailUrl,
      videoUrl: video.url,
      isPlaceholderThumbnail: !video.thumbnail || video.thumbnail.includes('placeholder')
    });
  }, [video]);

  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg group">
        <VideoThumbnail 
          thumbnail={thumbnailUrl}
          title={video.title || video.prompt}
          url={video.url}
        />
        
        <div className="p-3 flex-grow flex flex-col justify-between">
          <PromptPopover 
            prompt={video.prompt}
            truncatedPrompt={truncatedPrompt}
          />
          
          <div className="text-xs text-muted-foreground mt-2">
            {formattedDate}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default VideoCard;
