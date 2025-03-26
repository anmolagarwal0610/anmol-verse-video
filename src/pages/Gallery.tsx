
import GalleryLayout from '@/components/gallery/GalleryLayout';
import GalleryHeader from '@/components/gallery/GalleryHeader';
import GalleryTabs from '@/components/gallery/GalleryTabs';

const Gallery = () => {
  return (
    <GalleryLayout>
      <GalleryHeader />
      <GalleryTabs />
    </GalleryLayout>
  );
};

export default Gallery;
