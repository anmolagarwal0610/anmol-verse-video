
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageCard from '@/components/ImageCard';
import EmptyState from '@/components/EmptyState';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

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

const ImagesTab = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
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

    fetchImages();
  }, [user]);

  if (isLoadingImages) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
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
    );
  }

  return (
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
  );
};

export default ImagesTab;
