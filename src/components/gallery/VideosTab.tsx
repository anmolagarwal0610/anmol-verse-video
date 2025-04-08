
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
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('VideosTab: Current auth user:', user?.id);
        console.log('VideosTab: Starting video fetch process...');
        
        const { data: directDbVideos, error: dbError } = await supabase
          .from('generated_videos')
          .select('*');
          
        console.log('Direct DB query results:', { 
          data: directDbVideos, 
          count: directDbVideos?.length || 0,
          error: dbError
        });
        
        // More detailed logging for direct DB videos
        if (directDbVideos && directDbVideos.length > 0) {
          console.log('Direct DB videos detail:');
          directDbVideos.forEach((video, index) => {
            console.log(`Video #${index + 1}:`, {
              id: video.id,
              topic: video.topic,
              thumbnail_url: video.thumbnail_url || 'null/undefined',
              video_url: video.video_url || 'null/undefined',
              created_at: video.created_at
            });
          });
        }
        
        console.log('Fetching videos via API function...');
        const fetchedVideos = await getVideos();
        console.log(`Fetched ${fetchedVideos.length} videos:`, fetchedVideos);
        
        // Log the thumbnail URLs specifically
        console.log('Thumbnail URLs from fetched videos:');
        fetchedVideos.forEach((video, index) => {
          const thumbnailSource = video.thumbnail 
            ? (video.thumbnail.startsWith('data:') ? 'Using embedded SVG' : 'From API')
            : 'No thumbnail';
          console.log(`Video #${index + 1} thumbnail:`, {
            url: video.thumbnail ? (video.thumbnail.length > 100 ? 'Embedded SVG data URL' : video.thumbnail) : 'none',
            source: thumbnailSource,
            videoUrl: video.url ? 'Present' : 'Missing'
          });
        });
        
        // Validate video URLs before setting state
        const validVideos = fetchedVideos.filter(video => {
          if (!video.url) {
            console.warn(`VideosTab: Video ${video.id} has no URL, filtering out`);
            return false;
          }
          return true;
        });
        
        console.log(`VideosTab: ${validVideos.length} valid videos with URLs out of ${fetchedVideos.length} total`);
        
        const isMockData = validVideos.length > 0 && !validVideos[0]?.id.includes('-');
        if (isMockData) {
          console.warn('WARNING: Using mock video data fallback!');
          toast.warning('Could not connect to the server. Showing sample videos instead.');
        }
        
        setVideos(validVideos);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error fetching videos:', error);
        setError(errorMessage);
        toast.error('Failed to load videos');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, [user]);
  
  // Add a validation effect to ensure we have valid video objects
  useEffect(() => {
    if (videos.length > 0) {
      console.log('VideosTab: Validating video objects...');
      const validVideos = videos.filter(video => {
        const isValid = Boolean(video && video.id && video.url);
        if (!isValid) {
          console.warn('VideosTab: Found invalid video object:', video);
        } else {
          console.log(`VideosTab: Valid video found - ID: ${video.id}, URL: ${video.url.substring(0, 50)}...`);
        }
        return isValid;
      });
      
      if (validVideos.length !== videos.length) {
        console.warn(`VideosTab: Filtered out ${videos.length - validVideos.length} invalid videos`);
        setVideos(validVideos);
      } else {
        console.log('VideosTab: All video objects are valid');
      }
    }
  }, [videos]);
  
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
