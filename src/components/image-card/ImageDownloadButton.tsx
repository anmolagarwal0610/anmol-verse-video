
import { useState } from 'react';
import { ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImageDownloadButtonProps {
  imageUrl: string;
  prompt?: string;
  variant?: 'overlay' | 'standalone';
  isDownload?: boolean;
}

const ImageDownloadButton = ({ 
  imageUrl, 
  prompt, 
  variant = 'standalone',
  isDownload = false
}: ImageDownloadButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    
    try {
      console.log('Downloading file:', imageUrl);
      
      // Create a direct link to download the file
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${prompt ? prompt.substring(0, 20) : 'image'}-${Date.now()}.png`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenInNewTab = () => {
    setIsLoading(true);
    
    try {
      console.log('Opening image in new tab:', imageUrl);
      
      // Detect zip files by extension or content type hint
      const isZipFile = imageUrl.toLowerCase().endsWith('.zip') || 
                        imageUrl.includes('zip') || 
                        imageUrl.includes('archive');
      
      if (isZipFile) {
        toast.info('Opening archive in a new tab. Your browser will handle the download.');
      }
      
      // Open the image in a new tab without using a proxy
      window.open(imageUrl, '_blank');
      
      if (!isZipFile) {
        toast.success('Image opened in new tab');
      }
    } catch (error) {
      console.error('Error opening image/file:', error);
      toast.error('Failed to open file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAction = isDownload ? handleDownload : handleOpenInNewTab;
  
  if (variant === 'overlay') {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={handleAction}
        disabled={isLoading}
      >
        {isDownload ? (
          <Download className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
        ) : (
          <ExternalLink className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
        )}
      </Button>
    );
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
      onClick={handleAction}
      disabled={isLoading}
    >
      {isDownload ? (
        <>
          <Download className={`h-3.5 w-3.5 ${isLoading ? 'animate-pulse' : ''}`} />
          <span>{isLoading ? 'Downloading...' : 'Download'}</span>
        </>
      ) : (
        <>
          <ExternalLink className={`h-3.5 w-3.5 ${isLoading ? 'animate-pulse' : ''}`} />
          <span>{isLoading ? 'Opening...' : 'Open Image'}</span>
        </>
      )}
    </Button>
  );
};

export default ImageDownloadButton;
