import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImageDownloadButtonProps {
  imageUrl: string;
  prompt?: string;
  variant?: 'overlay' | 'standalone';
}

const ImageDownloadButton = ({ 
  imageUrl, 
  prompt, 
  variant = 'standalone'
}: ImageDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Clean up the URL by removing any query parameters
      const cleanUrl = imageUrl.split('?')[0];
      
      // If URL is from Supabase Storage, use it directly
      // Otherwise, for external URLs, we need to fetch and convert to blob
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `image-${prompt ? prompt.substring(0, 20).replace(/\s+/g, '-').toLowerCase() : 'download'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
      
      toast.success('Image downloaded successfully');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  if (variant === 'overlay') {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        <Download className={`h-4 w-4 ${isDownloading ? 'animate-pulse' : ''}`} />
      </Button>
    );
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
      onClick={handleDownload}
      disabled={isDownloading}
    >
      <Download className={`h-3.5 w-3.5 ${isDownloading ? 'animate-pulse' : ''}`} />
      <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
    </Button>
  );
};

export default ImageDownloadButton;
