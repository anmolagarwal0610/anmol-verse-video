
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
      
      try {
        // For non-authenticated users, always use default images
        if (!user) {
          console.log('No user, using default images');
          setImages(DEFAULT_IMAGES);
          setIsLoadingImages(false);
          return;
        }
        
        console.log('Fetching images for user:', user.id);
        const { data, error } = await supabase
          .from('generated_images')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.log('No images found for user, using default images');
          setImages(DEFAULT_IMAGES);
        } else {
          console.log(`Found ${data.length} images for user`);
          setImages(data);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        toast.error('Failed to load images. Using sample gallery.');
        // Always fallback to default images on error
        setImages(DEFAULT_IMAGES);
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchImages();
  }, [user]);

  return { images, isLoadingImages };
};
