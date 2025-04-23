
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
          console.log('🔎 [VideosTab] Sample video URL:', fetchedVideos[0].url);
        }
        
        // Filter out invalid videos (missing URL)
        const validVideos = fetchedVideos.filter(video => {
          const hasValidUrl = video.url && video.url.startsWith('http');
          if (!hasValidUrl) {
            console.warn('🔎 [VideosTab] Filtering out video with invalid URL:', video.id);
          }
          return hasValidUrl;
        });
        
        console.log('🔎 [VideosTab] Valid videos after URL check:', validVideos.length);
        
        // Filter out duplicate videos based on URL - keeping the newest one with each URL
        const uniqueVideos = validVideos.reduce<VideoData[]>((acc, current) => {
          const existingVideoIndex = acc.findIndex(v => v.url === current.url);
          
          if (existingVideoIndex >= 0) {
            // If this video is newer than the existing one, replace it
            const existingVideo = acc[existingVideoIndex];
            const existingDate = new Date(existingVideo.created_at).getTime();
            const currentDate = new Date(current.created_at).getTime();
            
            if (currentDate > existingDate) {
              acc[existingVideoIndex] = current;
            }
          } else {
            // This is a unique video URL, add it to our list
            acc.push(current);
          }
          
          return acc;
        }, []);
        
        // Sort videos by creation date, newest first
        uniqueVideos.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        console.log('🔎 [VideosTab] Unique videos after filtering:', uniqueVideos.length);
        
        if (uniqueVideos.length > 0) {
          console.log('🔎 [VideosTab] First video sample:', JSON.stringify(uniqueVideos[0], null, 2));
        }
        
        setVideos(uniqueVideos);
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
          message="Videos are stored for 7 days. Download any videos you want to keep."
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video, index) => (
          <VideoCard key={video.id || index} video={video} index={index} />
        ))}
      </div>
    </>
  );
};

export default VideosTab;
