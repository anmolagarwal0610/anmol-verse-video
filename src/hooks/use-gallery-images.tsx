
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { GeneratedImage, DEFAULT_IMAGES } from '@/components/gallery/GalleryTypes';
import { useAuth } from './use-auth';

// Extended type to include the hasInvalidUrl property
interface ProcessedImage extends GeneratedImage {
  hasInvalidUrl?: boolean;
}

export const useGalleryImages = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const { user } = useAuth();

  // Define a function to get a fresh URL if needed
  const getFreshPublicUrl = useCallback(async (storageUrl: string): Promise<string | null> => {
    try {
      // Extract bucket name and path from the URL
      // Check if this is a Supabase Storage URL
      if (storageUrl.includes('storage/v1/object')) {
        // Extract bucket name and path using regex
        const storagePathRegex = /storage\/v1\/object\/(?:public|authenticated)\/([^\/]+)\/([^?]+)/;
        const storagePathMatch = storageUrl.match(storagePathRegex);
        
        if (!storagePathMatch) {
          console.log('URL does not match Supabase Storage pattern:', storageUrl.substring(0, 30) + '...');
          return storageUrl; // Return original URL if not a Supabase URL
        }
        
        const bucketName = storagePathMatch[1];
        const filePath = decodeURIComponent(storagePathMatch[2]);
        
        console.log(`Getting fresh URL for bucket: ${bucketName}, path: ${filePath}`);
        
        // Get a fresh public URL
        const { data } = await supabase
          .storage
          .from(bucketName)
          .getPublicUrl(filePath);
        
        if (data?.publicUrl) {
          console.log(`Fresh URL generated: ${data.publicUrl.substring(0, 30)}...`);
          return data.publicUrl;
        }
        
        console.warn('No public URL returned from Supabase');
        return null;
      }
      
      // For other URLs, just return the original
      return storageUrl;
    } catch (error) {
      console.error('Error getting fresh URL:', error);
      return null;
    }
  }, []);

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
        
        // Process the images and refresh URLs if needed
        const processedImages: ProcessedImage[] = await Promise.all(data.map(async (img) => {
          try {
            // Skip processing if not a valid URL
            if (!img.image_url || typeof img.image_url !== 'string') {
              console.warn(`Image ${img.id} has invalid URL: ${String(img.image_url)}`);
              return { ...img, hasInvalidUrl: true };
            }
            
            // For Supabase Storage URLs, refresh them
            if (img.image_url.includes('storage/v1/object')) {
              console.log(`Refreshing Supabase URL for image ${img.id}`);
              const freshUrl = await getFreshPublicUrl(img.image_url);
              
              if (freshUrl) {
                return {
                  ...img,
                  image_url: freshUrl
                };
              }
            } 
            // For other external URLs, use them directly
            else if (img.image_url.startsWith('http')) {
              console.log(`Image ${img.id} uses external URL: ${img.image_url.substring(0, 30)}...`);
              return img;
            }
          } catch (processError) {
            console.error(`Error processing image ${img.id}:`, processError);
          }
          
          // Return the original image if we couldn't process it
          return img;
        }));
        
        if (isMounted) {
          // Filter out any images with invalid URLs
          const validImages = processedImages.filter(img => 
            img.image_url && 
            typeof img.image_url === 'string' && 
            img.image_url.startsWith('http') &&
            !img.hasInvalidUrl
          );
          
          console.log(`Setting ${validImages.length} valid images out of ${processedImages.length} total`);
          
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
  }, [user, getFreshPublicUrl]);

  return { images, isLoadingImages };
};
