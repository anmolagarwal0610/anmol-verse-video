
import { Loader2 } from 'lucide-react';

interface ImageLoadingOverlayProps {
  isLoading: boolean;
}

const ImageLoadingOverlay = ({ isLoading }: ImageLoadingOverlayProps) => {
  if (!isLoading) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  );
};

export default ImageLoadingOverlay;
