
import { useEffect, useState } from 'react';
import { getVideos } from '@/lib/videoApi';
import VideoCard, { VideoData } from '@/components/video-card';
import EmptyState from '@/components/EmptyState';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-primary" />
        <span>Loading videos...</span>
      </div>
    );
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
