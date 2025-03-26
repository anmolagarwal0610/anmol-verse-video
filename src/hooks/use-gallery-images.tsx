
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
      
      // Always set a fallback for non-authenticated users
      if (!user) {
        console.log('No user, using default images');
        setImages(DEFAULT_IMAGES);
        setIsLoadingImages(false);
        return;
      }
      
      try {
        console.log('Fetching images for user:', user.id);
        const { data, error } = await supabase
          .from('generated_images')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // If no images found for user, show default images
        if (!data || data.length === 0) {
          console.log('No images found, using default images');
          setImages(DEFAULT_IMAGES);
        } else {
          console.log('Fetched images:', data.length);
          setImages(data);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        toast.error('Failed to load your images');
        // Fallback to default images on error
        setImages(DEFAULT_IMAGES);
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchImages();
  }, [user]);

  return { images, isLoadingImages };
};
