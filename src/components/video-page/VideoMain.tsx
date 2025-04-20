
import React from 'react';
import { motion } from 'framer-motion';
import { VideoPlayer } from '@/components/video-player';
import { Skeleton } from '@/components/ui/skeleton';
import { VideoData } from '@/components/video-card';

interface VideoMainProps {
  video: VideoData | null;
  isLoading: boolean;
}

const VideoMain = ({ video, isLoading }: VideoMainProps) => {
  if (isLoading) {
    return <Skeleton className="aspect-[9/16] w-full max-w-md rounded-xl" />;
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Video not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <VideoPlayer 
        videoUrl={video.url} 
        poster={video.thumbnail}
      />
    </motion.div>
  );
};

export default VideoMain;
