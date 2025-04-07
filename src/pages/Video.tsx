
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/video-player';
import { getVideoById } from '@/lib/api';
import { VideoData } from '@/components/video-card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Download, 
  Share, 
  Clock, 
  FileText, 
  Music, 
  Archive,
  FileVideo
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
              <Link to="/gallery#videos" className="flex items-center">
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
                className="glass-panel rounded-xl p-6 mb-6"
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
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button 
                        className="flex-1"
                        asChild
                      >
                        <a href={video.url} download target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Download Video
                        </a>
                      </Button>
                      
                      <Button variant="outline" onClick={handleShare}>
                        <Share className="h-4 w-4" />
                        <span className="sr-only">Share</span>
                      </Button>
                    </div>
                  </>
                ) : (
                  <p>No video details available</p>
                )}
              </motion.div>
              
              {!isLoading && video && (video.audioUrl || video.transcriptUrl || video.imagesZipUrl) && (
                <motion.div 
                  className="glass-panel rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="text-lg font-medium mb-4">Resources</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {video.audioUrl && (
                        <TableRow>
                          <TableCell className="flex items-center">
                            <Music className="h-4 w-4 mr-2 text-blue-500" />
                            <span>Audio</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.open(video.audioUrl, '_blank')}
                            >
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download Audio</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                      
                      {video.transcriptUrl && (
                        <TableRow>
                          <TableCell className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-green-500" />
                            <span>Transcript</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.open(video.transcriptUrl, '_blank')}
                            >
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download Transcript</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                      
                      {video.imagesZipUrl && (
                        <TableRow>
                          <TableCell className="flex items-center">
                            <Archive className="h-4 w-4 mr-2 text-amber-500" />
                            <span>Images Archive</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.open(video.imagesZipUrl, '_blank')}
                            >
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download Images</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </motion.div>
              )}
              
              <motion.div
                className="mt-6 glass-panel rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-lg font-medium mb-4">Generate Similar</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Create another video with a similar style or concept.
                </p>
                <Button className="w-full" asChild>
                  <Link to="/videos/generate">Create New Video</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Video;
