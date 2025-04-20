
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { GeneratedImage, DEFAULT_IMAGES } from '@/components/gallery/GalleryTypes';
import { useAuth } from './use-auth';

// Define a type that reflects what Supabase actually returns
interface SupabaseImageResult {
  id: string;
  image_url: string;
  prompt: string;
  created_at: string;
  model: string;
  preferences?: string[] | null;
  user_id?: string | null;
  width: number;
  height: number;
  expiry_time?: string; // Make it optional since some existing records might not have it yet
}

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
        
        // Get the database records with the image URLs
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
          console.log('No images found for user');
          if (isMounted) {
            setImages([]);
            setIsLoadingImages(false);
          }
          return;
        }
        
        console.log(`Found ${data.length} images for user`);
        
        // Filter out any images with invalid URLs
        const validImages = (data as SupabaseImageResult[]).filter(img => 
          img.image_url && 
          typeof img.image_url === 'string' && 
          img.image_url.startsWith('http')
        ).map(img => ({
          ...img,
          // If there's no expiry_time in the database, set a default 30 days from created_at
          expiry_time: img.expiry_time || new Date(new Date(img.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }));
        
        console.log(`Setting ${validImages.length} valid images out of ${data.length} total`);
        
        if (isMounted) {
          setImages(validImages as GeneratedImage[]);
          setIsLoadingImages(false);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        toast.error('Failed to load your images.');
        
        // Set empty array on error for authenticated users
        if (isMounted) {
          setImages(user ? [] : DEFAULT_IMAGES);
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
