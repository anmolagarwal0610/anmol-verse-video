
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
          
          // Process the images and create public URLs when needed
          const processedImages = await Promise.all(data.map(async (img) => {
            // If the URL is already public or contains a valid full URL, use it directly
            if (img.image_url.startsWith('http') && !img.image_url.includes('?token=')) {
              return { ...img };
            }
            
            // For URLs that might be from Supabase Storage, get a fresh public URL
            if (img.image_url.includes('storage/v1/object')) {
              try {
                // Extract the path from the URL
                const urlPath = img.image_url.split('/storage/v1/object/public/')[1]?.split('?')[0];
                
                if (urlPath) {
                  const bucketName = urlPath.split('/')[0];
                  const filePath = urlPath.split('/').slice(1).join('/');
                  
                  // Get a fresh public URL with longer expiry
                  const { data: publicUrlData } = await supabase
                    .storage
                    .from(bucketName)
                    .getPublicUrl(filePath);
                    
                  if (publicUrlData?.publicUrl) {
                    return {
                      ...img,
                      image_url: publicUrlData.publicUrl
                    };
                  }
                }
              } catch (urlError) {
                console.error('Error creating public URL:', urlError);
                // Fall back to the original URL if there's an error
              }
            }
            
            // Return the original image if we couldn't process it
            return { ...img };
          }));
          
          setImages(processedImages);
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
