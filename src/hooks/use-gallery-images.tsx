
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
        
        // First get the database records
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
          if (isMounted) {
            setImages(DEFAULT_IMAGES);
            setIsLoadingImages(false);
          }
          return;
        }
        
        console.log(`Found ${data.length} images for user`);
        
        // Process the images with guaranteed fresh public URLs for Supabase storage paths
        const processedImages = await Promise.all(data.map(async (img) => {
          console.log(`Processing image: ${img.id}, URL: ${img.image_url.substring(0, 50)}...`);
          
          try {
            // Check if URL is from Supabase Storage (contains storage/v1/object)
            if (img.image_url.includes('storage/v1/object')) {
              // Extract bucket name and path
              const storagePathMatch = img.image_url.match(/storage\/v1\/object\/public\/([^\/]+)\/(.+?)(?:\?|$)/);
              
              if (storagePathMatch) {
                const bucketName = storagePathMatch[1];
                let filePath = storagePathMatch[2];
                
                // Remove any query parameters from the file path
                filePath = filePath.split('?')[0];
                
                console.log(`Generating fresh URL for bucket: ${bucketName}, path: ${filePath}`);
                
                // Get a fresh public URL
                const { data: publicUrlData } = await supabase
                  .storage
                  .from(bucketName)
                  .getPublicUrl(filePath);
                
                if (publicUrlData?.publicUrl) {
                  console.log(`Generated fresh URL: ${publicUrlData.publicUrl.substring(0, 50)}...`);
                  return {
                    ...img,
                    image_url: publicUrlData.publicUrl
                  };
                } else {
                  console.warn(`Failed to generate public URL for: ${img.id}`);
                }
              } else {
                console.warn(`Could not parse storage path from URL: ${img.image_url.substring(0, 50)}...`);
              }
            } else if (img.image_url.startsWith('http')) {
              // For external URLs, use them directly
              console.log(`Using external URL directly: ${img.image_url.substring(0, 50)}...`);
              return { ...img };
            }
          } catch (error) {
            console.error(`Error processing image ${img.id}:`, error);
          }
          
          // Return the original image if we couldn't process it
          return { ...img };
        }));
        
        if (isMounted) {
          console.log(`Setting ${processedImages.length} processed images`);
          setImages(processedImages);
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
