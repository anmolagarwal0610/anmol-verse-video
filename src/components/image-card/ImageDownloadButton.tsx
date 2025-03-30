
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
      console.log('Starting download for image URL:', imageUrl);
      
      // Create a direct link to the image
      const a = document.createElement('a');
      a.href = imageUrl;
      
      // Create a safe filename from the prompt or use a timestamp
      const safeFileName = prompt 
        ? prompt.substring(0, 20).replace(/[^a-z0-9]/gi, '-').toLowerCase() 
        : `image-${Date.now()}`;
        
      a.download = `${safeFileName}.png`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('Image downloaded successfully');
      console.log('Download requested successfully');
    } catch (error) {
      console.error('Error initiating download:', error);
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
