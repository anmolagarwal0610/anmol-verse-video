
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';
import { useAuth } from '@/hooks/use-auth';
import { useGalleryImages } from '@/hooks/use-gallery-images';
import GalleryImageGrid from './GalleryImageGrid';
import GalleryNotice from './GalleryNotice';

const ImagesTab = () => {
  const { images, isLoadingImages } = useGalleryImages();
  const { user } = useAuth();

  if (isLoadingImages) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-indigo-600">Loading gallery...</span>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <EmptyState
        title={user ? "No images yet" : "Sign in to create images"}
        description={user ? "Generate some images to see them here" : "Create an account to generate and save your own images"}
        action={
          <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            <Link to={user ? "/images" : "/auth"}>{user ? "Create Image" : "Sign In"}</Link>
          </Button>
        }
        className="py-24"
      />
    );
  }

  return (
    <>
      {user && (
        <GalleryNotice message="Images are automatically deleted after 7 days. Download any images you want to keep." />
      )}
      <GalleryImageGrid images={images} />
    </>
  );
};

export default ImagesTab;
