
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { GeneratedImage, DEFAULT_IMAGES } from '@/components/gallery/GalleryTypes';
import { useAuth } from './use-auth';

export const useGalleryImages = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoadingImages(true);
      
      if (!user) {
        setImages(DEFAULT_IMAGES);
        setIsLoadingImages(false);
        return;
      }
      
      try {
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

  return { images, isLoadingImages };
};
