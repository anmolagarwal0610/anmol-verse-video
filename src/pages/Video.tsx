
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/video-player';
import { getVideoById } from '@/lib/api';
import { VideoData } from '@/components/video-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Share, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const Video = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const videoData = await getVideoById(id);
        setVideo(videoData);
      } catch (error) {
        console.error('Error fetching video:', error);
        toast.error('Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideo();
  }, [id]);
  
  const handleShare = () => {
    if (navigator.share && video) {
      navigator.share({
        title: `Video: ${video.prompt}`,
        text: `Check out this AI-generated video: ${video.prompt}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16 mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              asChild
            >
              <Link to="/gallery" className="flex items-center">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Gallery
              </Link>
            </Button>
            
            {isLoading ? (
              <Skeleton className="h-8 w-64 mb-2" />
            ) : (
              <h1 className="text-2xl font-bold">{video?.prompt}</h1>
            )}
            
            {isLoading ? (
              <Skeleton className="h-5 w-48" />
            ) : (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {video && new Date(video.created_at).toLocaleString()}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 flex justify-center">
              {isLoading ? (
                <Skeleton className="aspect-[9/16] w-full max-w-md rounded-xl" />
              ) : video ? (
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
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>Video not found</p>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-2">
              <motion.div 
                className="glass-panel rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-lg font-medium mb-4">Video Details</h2>
                
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                  </div>
                ) : video ? (
                  <>
                    <div className="space-y-4 mb-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Prompt</h3>
                        <p className="mt-1">{video.prompt}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Creation Date</h3>
                        <p className="mt-1">{new Date(video.created_at).toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Video ID</h3>
                        <p className="mt-1 text-sm font-mono">{video.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-3">
                      <Button asChild>
                        <a href={video.url} download>
                          <Download className="h-4 w-4 mr-2" />
                          Download Video
                        </a>
                      </Button>
                      
                      <Button variant="outline" onClick={handleShare}>
                        <Share className="h-4 w-4 mr-2" />
                        Share Video
                      </Button>
                    </div>
                  </>
                ) : (
                  <p>No video details available</p>
                )}
              </motion.div>
              
              <motion.div
                className="mt-6 glass-panel rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-lg font-medium mb-4">Generate Similar</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Create another video with a similar style or concept.
                </p>
                <Button className="w-full" asChild>
                  <Link to="/">Create New Video</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t mt-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ShortsGen. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Video;
