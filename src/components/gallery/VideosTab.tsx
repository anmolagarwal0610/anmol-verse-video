import { useEffect, useState } from 'react';
import { getVideos } from '@/lib/videoApi';
import VideoCard, { VideoData } from '@/components/video-card';
import EmptyState from '@/components/EmptyState';
import { toast } from 'sonner';
import { Loader2, FileVideo } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const VideosTab = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        console.log('VideosTab: Current auth user:', user?.id);
        
        const { data: directDbVideos, error: dbError } = await supabase
          .from('generated_videos')
          .select('*');
          
        console.log('Direct DB query results:', { 
          data: directDbVideos, 
          count: directDbVideos?.length || 0,
          error: dbError
        });
        
        console.log('Fetching videos via API function...');
        const fetchedVideos = await getVideos();
        console.log(`Fetched ${fetchedVideos.length} videos:`, fetchedVideos);
        
        const isMockData = !fetchedVideos[0]?.id.includes('-');
        if (isMockData) {
          console.warn('WARNING: Using mock video data fallback!');
        }
        
        setVideos(fetchedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error('Failed to load videos');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-primary" />
        <span>Loading videos...</span>
      </div>
    );
  }
  
  if (!videos || videos.length === 0) {
    return (
      <EmptyState 
        title="No videos yet"
        description="Generate your first video to see it here"
        icon={<FileVideo className="h-10 w-10 text-muted-foreground" />}
        action={
          <Button onClick={() => navigate('/videos/generate')}>
            Create a Video
          </Button>
        }
      />
    );
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
