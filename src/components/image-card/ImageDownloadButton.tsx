
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
      console.log('Downloading image from URL:', imageUrl);
      
      // Detect file type from URL or extension
      const isZipFile = imageUrl.toLowerCase().endsWith('.zip') || imageUrl.includes('zip');
      const isAudioFile = imageUrl.toLowerCase().endsWith('.mp3') || imageUrl.includes('audio');
      const isTextFile = imageUrl.toLowerCase().endsWith('.txt') || imageUrl.includes('transcript');
      const isVideoFile = imageUrl.toLowerCase().endsWith('.mp4') || imageUrl.includes('video');
      
      // Determine file name
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      let fileName = "";
      
      if (isZipFile) {
        fileName = `images-${timestamp}.zip`;
      } else if (isAudioFile) {
        fileName = `audio-${timestamp}.mp3`;
      } else if (isTextFile) {
        fileName = `transcript-${timestamp}.txt`;
      } else if (isVideoFile) {
        fileName = `video-${timestamp}.mp4`;
      } else {
        fileName = `image-${timestamp}.jpg`;
      }
      
      // Create link element
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = fileName;
      link.target = '_blank';
      
      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Download started for ${fileName}`);
      
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download. Please try again.');
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
