
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GalleryLayout from '@/components/gallery/GalleryLayout';
import GalleryHeader from '@/components/gallery/GalleryHeader';
import GalleryTabs from '@/components/gallery/GalleryTabs';

const Gallery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    console.log("Gallery page mounted, path:", location.pathname);
    
    // If no hash is present, default to the images tab
    if (!location.hash) {
      navigate('/gallery#images', { replace: true });
    }
  }, [location.pathname, navigate]);
  
  return (
    <GalleryLayout>
      <GalleryHeader />
      <GalleryTabs />
    </GalleryLayout>
  );
};

export default Gallery;
