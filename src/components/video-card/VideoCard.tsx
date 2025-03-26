
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import VideoThumbnail from './VideoThumbnail';
import PromptPopover from './PromptPopover';
import { VideoCardProps } from './types';

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

  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg group">
        <VideoThumbnail 
          thumbnail={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
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
