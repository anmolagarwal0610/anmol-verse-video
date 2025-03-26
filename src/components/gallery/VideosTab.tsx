import { useEffect, useState } from 'react';
import { getVideos } from '@/lib/api';
import VideoCard, { VideoData } from '@/components/video-card';
import EmptyState from '@/components/EmptyState';
import { toast } from 'sonner';

const VideosTab = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const fetchedVideos = await getVideos();
        setVideos(fetchedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error('Failed to load videos');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, []);
  
  if (isLoading) {
    return <p>Loading videos...</p>;
  }
  
  if (!videos || videos.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video, index) => (
        <VideoCard key={video.id} video={video} index={index} />
      ))}
    </div>
  );
};

export default VideosTab;
