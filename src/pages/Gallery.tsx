
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GalleryLayout from '@/components/gallery/GalleryLayout';
import GalleryHeader from '@/components/gallery/GalleryHeader';
import GalleryTabs from '@/components/gallery/GalleryTabs';

const Gallery = () => {
  const navigate = useNavigate();
  
  // Ensure the app stays on this page after refresh or direct access
  useEffect(() => {
    console.log("Gallery page mounted");
  }, []);
  
  return (
    <GalleryLayout>
      <GalleryHeader />
      <GalleryTabs />
    </GalleryLayout>
  );
};

export default Gallery;
