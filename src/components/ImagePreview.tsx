
import { useState, useEffect, useRef } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImagePreviewProps {
  imageUrl: string | null;
  outputFormat: string;
  onDownload: () => void;
}

const ImagePreview = ({ imageUrl, outputFormat, onDownload }: ImagePreviewProps) => {
  const isMobile = useIsMobile();
  const [imgSrc, setImgSrc] = useState<string | null>(imageUrl);
  const [imgError, setImgError] = useState<boolean>(false);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Update image source when imageUrl prop changes
  useEffect(() => {
    if (imageUrl) {
      setImgSrc(imageUrl);
      setImgError(false);
      setIsImageLoaded(false);
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
    console.log('Image failed to load directly, attempting CORS proxy fallback');
    setImgError(true);
    setImgSrc('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjY0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGI1NTYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=');
  };
  
  const handleImageLoad = () => {
    setIsImageLoaded(true);
    setImgError(false);
  };
  
  const handleCanvasDownload = () => {
    if (!imageRef.current || imgError) return;
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        toast.error('Unable to create canvas context');
        return;
      }
      
      // Set canvas dimensions to match the image
      canvas.width = imageRef.current.naturalWidth;
      canvas.height = imageRef.current.naturalHeight;
      
      // Draw the image onto the canvas
      ctx.drawImage(imageRef.current, 0, 0);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Failed to create image data');
          return;
        }
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `Image_${timestamp}.${outputFormat || 'png'}`;
        link.href = url;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
        
        // Call the onDownload callback
        onDownload();
        toast.success('Image downloaded successfully');
      }, `image/${outputFormat || 'png'}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center group">
      <img 
        ref={imageRef}
        src={imgSrc} 
        alt="Generated" 
        className={`max-w-full max-h-full w-auto h-auto object-contain border border-indigo-200/20 rounded-lg shadow-lg ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        crossOrigin="anonymous"
      />
      
      {!isImageLoaded && !imgError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      )}
      
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
        
        {!imgError && isImageLoaded && (
          <Button
            onClick={handleCanvasDownload}
            size={isMobile ? "sm" : "default"}
            variant="default"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2 h-4 w-4"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Image
          </Button>
        )}
      </div>
      
      {imgError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700/50 backdrop-blur-sm">
          <p className="text-white text-sm">Unable to load image</p>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
