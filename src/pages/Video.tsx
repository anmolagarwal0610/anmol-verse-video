
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, FileX } from 'lucide-react';
import { getVideoById } from '@/lib/video/services/videoManagement';
import { VideoData } from '@/components/video-card/types';
import { toast } from 'sonner';
import VideoDetails from '@/components/video-page/VideoDetails';
import VideoMain from '@/components/video-page/VideoMain';
import VideoResources from '@/components/video-page/VideoResources';
import CreateNewButton from '@/components/video-page/CreateNewButton';
import { isPast } from 'date-fns';

const Video = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  
  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const videoData = await getVideoById(id);
        
        if (videoData) {
          // Check if video is expired
          if (videoData.expiryTime && isPast(new Date(videoData.expiryTime))) {
            setIsExpired(true);
          }
          setVideo(videoData);
        } else {
          // Handle case where video doesn't exist
          toast.error('Video not found');
        }
      } catch (error) {
        console.error('Error fetching video:', error);
        toast.error('Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideo();
  }, [id]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16 mt-10">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            asChild
          >
            <Link to="/gallery#videos" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Gallery
            </Link>
          </Button>
          
          <VideoDetails video={video} isLoading={isLoading} />
          
          {isExpired && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 px-4 glass-panel rounded-xl mb-8">
              <FileX className="h-16 w-16 text-red-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Video has expired</h2>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                This video has expired and is no longer available. Videos are automatically removed after 7 days.
              </p>
              <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Link to="/videos/generate">Create a New Video</Link>
              </Button>
            </div>
          )}
          
          {!isExpired && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 flex justify-center">
                <VideoMain video={video} isLoading={isLoading} />
              </div>
              
              <div className="lg:col-span-2">
                {!isLoading && video && (
                  <>
                    <motion.div 
                      className="glass-panel rounded-xl p-6 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <h2 className="text-lg font-medium mb-4">Video Details</h2>
                      <div className="space-y-4 mb-6">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Prompt</h3>
                          <p className="mt-1">{video.prompt}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Creation Date</h3>
                          <p className="mt-1">{new Date(video.created_at).toLocaleDateString()}</p>
                        </div>
                        {video.expiryTime && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Expires On</h3>
                            <p className="mt-1">{new Date(video.expiryTime).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                    
                    <VideoResources video={video} />
                    <CreateNewButton />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Video;
