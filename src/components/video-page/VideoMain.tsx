
import React from 'react';
import { motion } from 'framer-motion';
import VideoPlayer from '@/components/video-player';
import { Skeleton } from '@/components/ui/skeleton';
import { VideoData } from '@/components/video-card';
import { FileX } from 'lucide-react';
import { isPast } from 'date-fns';

interface VideoMainProps {
  video: VideoData | null;
  isLoading: boolean;
}

const VideoMain = ({ video, isLoading }: VideoMainProps) => {
  // Check if video is expired
  const isExpired = video?.expiryTime ? isPast(new Date(video.expiryTime)) : false;

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
  
  if (isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md aspect-[9/16] bg-gray-100 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center p-6"
      >
        <FileX className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Video has expired
        </h3>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          This content is no longer available as it has exceeded its storage period.
        </p>
      </motion.div>
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
