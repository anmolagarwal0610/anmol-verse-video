
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import VideoThumbnail from './VideoThumbnail';
import PromptPopover from './PromptPopover';
import { VideoCardProps } from './types';
import { useEffect } from 'react';
import { toast } from 'sonner';

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
    
  // Use an embedded SVG data URL as fallback to ensure it always works
  const fallbackThumbnail = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjExMzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzRiNTU2MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlZpZGVvPC90ZXh0Pjwvc3ZnPg==';
  const thumbnailUrl = video.thumbnail || fallbackThumbnail;
  
  // Verify video URL validity
  useEffect(() => {
    if (!video.url || !video.url.startsWith('http')) {
      console.warn(`VideoCard: Invalid video URL detected for video ID ${video.id}:`, video.url);
    }
  }, [video.id, video.url]);

  // Log video data when component mounts
  useEffect(() => {
    console.log(`VideoCard: Rendering video card:`, {
      id: video.id,
      title: video.title || video.prompt,
      thumbnailUrl,
      videoUrl: video.url,
      hasNullThumbnail: !video.thumbnail,
      isPlaceholderThumbnail: !video.thumbnail || (video.thumbnail && video.thumbnail.includes('placeholder'))
    });
  }, [video, thumbnailUrl]);

  const handleCardClick = () => {
    if (!video.url) {
      toast.error("Sorry, this video doesn't have a playable URL");
      return;
    }
    
    // We could navigate to a dedicated video page, but for now we'll just use the thumbnail click handler
    console.log("VideoCard clicked, URL:", video.url);
  };

  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <Card 
        className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg group cursor-pointer" 
        onClick={handleCardClick}
      >
        <VideoThumbnail 
          thumbnail={thumbnailUrl}
          title={video.title || video.prompt}
          url={video.url}
        />
        
        <div className="p-3 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-medium mb-1 line-clamp-1">
              {video.title || truncatedPrompt || "Untitled Video"}
            </h3>
            <PromptPopover 
              prompt={video.prompt}
              truncatedPrompt={truncatedPrompt}
            />
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            {formattedDate}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default VideoCard;
