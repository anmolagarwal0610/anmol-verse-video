
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
        
        // Process the images with reliable URL generation
        const processedImages = await Promise.all(data.map(async (img) => {
          console.log(`Processing image ID: ${img.id}, Storage URL: ${typeof img.image_url === 'string' ? img.image_url.substring(0, 30) + '...' : 'invalid URL'}`);
          
          try {
            // Check if URL is a Supabase Storage URL
            if (img.image_url && typeof img.image_url === 'string' && img.image_url.includes('storage/v1/object')) {
              console.log(`Image ${img.id} uses Supabase Storage`);
              
              // Extract bucket name and path using a more robust regex
              const storagePathRegex = /storage\/v1\/object\/(?:public|authenticated)\/([^\/]+)\/([^?]+)/;
              const storagePathMatch = img.image_url.match(storagePathRegex);
              
              if (storagePathMatch) {
                const bucketName = storagePathMatch[1];
                const filePath = storagePathMatch[2];
                
                console.log(`Extracted bucket: ${bucketName}, path: ${filePath}`);
                
                try {
                  // Get a fresh public URL
                  const { data: publicUrlData, error: urlError } = await supabase
                    .storage
                    .from(bucketName)
                    .getPublicUrl(filePath);
                  
                  if (urlError) {
                    console.error(`Error generating URL for image ${img.id}:`, urlError);
                    return img; // Return original image data
                  }
                  
                  if (publicUrlData?.publicUrl) {
                    console.log(`Generated fresh URL for ${img.id}: ${publicUrlData.publicUrl.substring(0, 30)}...`);
                    return {
                      ...img,
                      image_url: publicUrlData.publicUrl
                    };
                  } else {
                    console.warn(`No public URL generated for image ${img.id}`);
                  }
                } catch (urlGenError) {
                  console.error(`Error in URL generation for image ${img.id}:`, urlGenError);
                }
              } else {
                console.warn(`Could not parse storage path from URL for image ${img.id}: ${img.image_url.substring(0, 30)}...`);
              }
            } else if (img.image_url && typeof img.image_url === 'string' && img.image_url.startsWith('http')) {
              // For external URLs, use them directly
              console.log(`Image ${img.id} uses external URL: ${img.image_url.substring(0, 30)}...`);
              return img;
            } else {
              console.warn(`Image ${img.id} has invalid URL: ${String(img.image_url).substring(0, 30)}...`);
            }
          } catch (processError) {
            console.error(`Error processing image ${img.id}:`, processError);
          }
          
          // Return the original image if we couldn't process it
          return img;
        }));
        
        if (isMounted) {
          console.log(`Setting ${processedImages.length} processed images`);
          
          // Filter out any images with invalid URLs
          const validImages = processedImages.filter(img => 
            img.image_url && typeof img.image_url === 'string' && img.image_url.startsWith('http')
          );
          
          if (validImages.length < processedImages.length) {
            console.warn(`Filtered out ${processedImages.length - validImages.length} images with invalid URLs`);
          }
          
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
