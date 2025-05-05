
import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

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
  const [isOpening, setIsOpening] = useState(false);
  const { user } = useAuth();
  
  const handleOpenInNewTab = async () => {
    setIsOpening(true);
    
    try {
      console.log('Opening image in new tab:', imageUrl);
      
      // Detect zip files by extension or content type hint
      const isZipFile = imageUrl.toLowerCase().endsWith('.zip') || 
                        imageUrl.includes('zip') || 
                        imageUrl.includes('archive');
      
      if (isZipFile) {
        toast.info('Opening archive in a new tab. Your browser will handle the download.');
      }
      
      // Open the image directly - no proxy needed for opening in new tab
      window.open(imageUrl, '_blank');
      
      if (!isZipFile) {
        toast.success('Image opened in new tab');
      }
    } catch (error) {
      console.error('Error opening image/file:', error);
      toast.error('Failed to open file. Please try again.');
    } finally {
      setIsOpening(false);
    }
  };
  
  if (variant === 'overlay') {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={handleOpenInNewTab}
        disabled={isOpening}
      >
        <ExternalLink className={`h-4 w-4 ${isOpening ? 'animate-pulse' : ''}`} />
      </Button>
    );
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
      onClick={handleOpenInNewTab}
      disabled={isOpening}
    >
      <ExternalLink className={`h-3.5 w-3.5 ${isOpening ? 'animate-pulse' : ''}`} />
      <span>{isOpening ? 'Opening...' : 'Open Image'}</span>
    </Button>
  );
};

export default ImageDownloadButton;
