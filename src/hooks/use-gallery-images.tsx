
import { useState, useEffect } from 'react';
import { GeneratedImage, DEFAULT_IMAGES } from '@/components/gallery/GalleryTypes';
import { useAuth } from './use-auth';

export const useGalleryImages = () => {
  const [images, setImages] = useState<GeneratedImage[]>(DEFAULT_IMAGES);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Always use default images - no fetching from database
    console.log('Using default images only');
    setImages(DEFAULT_IMAGES);
    setIsLoadingImages(false);
  }, [user]);

  return { images, isLoadingImages };
};
