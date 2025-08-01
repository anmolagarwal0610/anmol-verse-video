
import { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import DownloadButton from '@/components/ui/download-button';

interface ImagePreviewProps {
  imageUrl: string | null;
  outputFormat: string;
  onDownload: () => void;
}

const ImagePreview = ({ imageUrl, outputFormat, onDownload }: ImagePreviewProps) => {
  const isMobile = useIsMobile();
  const [imgSrc, setImgSrc] = useState<string | null>(imageUrl);
  const [imgError, setImgError] = useState<boolean>(false);
  
  // Update image source when imageUrl prop changes
  useEffect(() => {
    if (imageUrl) {
      setImgSrc(imageUrl);
      setImgError(false);
    }
  }, [imageUrl]);
  
  if (!imgSrc) return null;

  const copyImageUrl = () => {
    if (!imageUrl) return;
    
    navigator.clipboard.writeText(imageUrl)
      .then(() => toast.success('Image URL copied to clipboard!'))
      .catch(() => toast.error('Failed to copy URL'));
  };
  
  const handleImageError = () => {
    setImgError(true);
    setImgSrc('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjY0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGI1NTYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=');
  };

  const handleDownloadComplete = () => {
    // Call the parent's onDownload callback
    onDownload();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center group">
      <img 
        src={imgSrc} 
        alt="Generated" 
        className="max-w-full max-h-full w-auto h-auto object-contain border border-indigo-200/20 rounded-lg shadow-lg"
        onError={handleImageError}
      />
      
      <div className={`absolute ${isMobile ? 'bottom-2 right-2' : 'bottom-4 right-4'} flex ${isMobile ? 'flex-col space-y-2' : 'space-x-3'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
        <Button 
          size={isMobile ? "sm" : "default"} 
          variant="secondary" 
          className="backdrop-blur-sm bg-white/20 hover:bg-white/40 border border-indigo-300/20"
          onClick={copyImageUrl}
          disabled={imgError}
        >
          <Copy className="h-4 w-4 mr-1" /> Copy URL
        </Button>
        
        {imageUrl && !imgError && (
          <DownloadButton 
            url={imageUrl} 
            fileType="image" 
            size={isMobile ? "sm" : "default"} 
            variant="default"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            onClick={handleDownloadComplete}
          />
        )}
      </div>
      
      {imgError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700/50 backdrop-blur-sm p-4">
          <p className="text-white text-sm mb-2 text-center">Unable to load image</p>
          <p className="text-white/70 text-xs text-center">The generated image may be available through the download button</p>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
