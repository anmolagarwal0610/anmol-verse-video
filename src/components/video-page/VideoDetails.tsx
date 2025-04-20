
import React from 'react';
import { Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { VideoData } from '@/components/video-card';

interface VideoDetailsProps {
  video: VideoData | null;
  isLoading: boolean;
}

const VideoDetails = ({ video, isLoading }: VideoDetailsProps) => {
  if (isLoading) {
    return (
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="mb-6">
        <p>Video not found</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">{video.prompt}</h1>
      <div className="flex items-center text-sm text-muted-foreground">
        <Clock className="h-4 w-4 mr-1" />
        {new Date(video.created_at).toLocaleString()}
      </div>
    </div>
  );
};

export default VideoDetails;
