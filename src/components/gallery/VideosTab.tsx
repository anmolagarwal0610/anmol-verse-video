
import { useEffect, useState } from 'react';
import { getVideos } from '@/lib/video/services/videoGallery';
import VideoCard from '@/components/video-card';
import { VideoData } from '@/components/video-card/types';
import EmptyState from '@/components/EmptyState';
import { toast } from 'sonner';
import { Loader2, FileVideo } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import GalleryNotice from './GalleryNotice';

const VideosTab = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('🔎 [VideosTab] Fetching videos, user authenticated:', !!user);
        console.log('🔎 [VideosTab] Auth state:', { user, isAuthenticated: !!user });
        
        if (!user) {
          console.log('🔎 [VideosTab] No authenticated user, cannot fetch videos');
          setVideos([]);
          setIsLoading(false);
          return;
        }

        console.log('🔎 [VideosTab] User ID for video fetch:', user.id);
        const fetchedVideos = await getVideos();
        console.log('🔎 [VideosTab] Videos fetched:', fetchedVideos.length);
        
        if (fetchedVideos.length > 0) {
          console.log('🔎 [VideosTab] First video sample:', JSON.stringify(fetchedVideos[0], null, 2));
        }
        
        setVideos(fetchedVideos);
      } catch (fetchError: any) {
        console.error('🔎 [VideosTab] Error fetching videos:', fetchError);
        setError(fetchError?.message || 'Failed to load videos');
        toast.error('Failed to load your videos.');
        setVideos([]);
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
  
  if (error) {
    return (
      <EmptyState 
        title="Error loading videos"
        description={error}
        icon={<FileVideo className="h-10 w-10 text-destructive" />}
        action={
          <Button onClick={() => navigate('/videos/generate')}>
            Try Creating a Video
          </Button>
        }
      />
    );
  }
  
  if (!videos || videos.length === 0) {
    return (
      <EmptyState 
        title={user ? "No videos yet" : "Sign in to create videos"}
        description={user ? "Generate your first video to see it here" : "Create an account to generate and save your own videos"}
        icon={<FileVideo className="h-10 w-10 text-muted-foreground" />}
        action={
          <Button onClick={() => navigate(user ? '/videos/generate' : '/auth')}>
            {user ? "Create a Video" : "Sign In"}
          </Button>
        }
      />
    );
  }
  
  return (
    <>
      {user && (
        <GalleryNotice 
          type="video"
          message="Download any videos you want to keep to your device."
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video, index) => (
          <VideoCard key={video.id} video={video} index={index} />
        ))}
      </div>
    </>
  );
};

export default VideosTab;
