
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import VideoCard, { VideoData } from '@/components/VideoCard';
import ImageCard from '@/components/ImageCard';
import EmptyState from '@/components/EmptyState';
import { getVideos } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Loader2, ImageIcon, VideoIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

interface GeneratedImage {
  id: string;
  image_url: string;
  prompt: string;
  created_at: string;
  expires_at: string;
  model: string;
  preferences?: string[] | null;
  user_id?: string | null;
  width: number;
  height: number;
}

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('images');
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoadingVideos(true);
        const data = await getVideos();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setIsLoadingVideos(false);
      }
    };

    const fetchImages = async () => {
      if (!user) return;
      
      try {
        setIsLoadingImages(true);
        const { data, error } = await supabase
          .from('generated_images')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setImages(data || []);
      } catch (error) {
        console.error('Error fetching images:', error);
        toast.error('Failed to load your images');
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchVideos();
    fetchImages();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16 mt-10">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Gallery</h1>
              <p className="text-muted-foreground">Browse and manage your generated content</p>
            </div>
            
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button asChild variant="outline" className="gap-2">
                <Link to="/images"><ImageIcon size={16} /> Create Image</Link>
              </Button>
              <Button asChild className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Link to="/"><VideoIcon size={16} /> Create Video</Link>
              </Button>
            </div>
          </div>
          
          <Tabs 
            defaultValue="images" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mb-8"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="images" className="gap-2">
                <ImageIcon size={16} /> Images
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                <VideoIcon size={16} /> Videos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="images" className="mt-6">
              {isLoadingImages ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              ) : images.length > 0 ? (
                <>
                  <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-lg text-sm text-indigo-800 dark:text-indigo-300">
                    <p>Images are automatically deleted after 7 days. Download any images you want to keep.</p>
                  </div>
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {images.map((image) => (
                      <ImageCard key={image.id} image={image} />
                    ))}
                  </motion.div>
                </>
              ) : (
                <EmptyState
                  title="No images yet"
                  description="Generate some images to see them here"
                  action={
                    <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                      <Link to="/images">Create Image</Link>
                    </Button>
                  }
                  className="py-24"
                />
              )}
            </TabsContent>
            
            <TabsContent value="videos" className="mt-6">
              {isLoadingVideos ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              ) : videos.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {videos.map((video, index) => (
                    <VideoCard key={video.id} video={video} index={index} />
                  ))}
                </motion.div>
              ) : (
                <EmptyState 
                  title="No videos yet"
                  description="Generate some videos to see them here"
                  action={
                    <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                      <Link to="/">Create Video</Link>
                    </Button>
                  }
                  className="py-24" 
                />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <footer className="py-6 border-t">
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

export default Gallery;
