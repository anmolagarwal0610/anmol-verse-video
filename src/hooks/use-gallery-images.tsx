
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
    let isMounted = true;
    
    const fetchImages = async () => {
      setIsLoadingImages(true);
      
      try {
        // For non-authenticated users, always use default images
        if (!user) {
          console.log('No user, using default images');
          if (isMounted) {
            setImages(DEFAULT_IMAGES);
            setIsLoadingImages(false);
          }
          return;
        }
        
        console.log('Fetching images for user:', user.id);
        
        // Get the database records
        const { data, error } = await supabase
          .from('generated_images')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.log('No images found for user, using default images');
          if (isMounted) {
            setImages(DEFAULT_IMAGES);
            setIsLoadingImages(false);
          }
          return;
        }
        
        console.log(`Found ${data.length} images for user`);
        
        // Filter out any images with invalid URLs
        const validImages = data.filter(img => 
          img.image_url && 
          typeof img.image_url === 'string' && 
          img.image_url.startsWith('http')
        );
        
        console.log(`Setting ${validImages.length} valid images out of ${data.length} total`);
        
        if (isMounted) {
          setImages(validImages.length > 0 ? validImages : DEFAULT_IMAGES);
          setIsLoadingImages(false);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        toast.error('Failed to load images. Using sample gallery.');
        
        // Always fallback to default images on error
        if (isMounted) {
          setImages(DEFAULT_IMAGES);
          setIsLoadingImages(false);
        }
      }
    };

    fetchImages();
    
    return () => {
      isMounted = false;
    };
  }, [user]);

  return { images, isLoadingImages };
};
