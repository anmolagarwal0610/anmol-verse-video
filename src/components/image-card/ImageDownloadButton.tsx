
import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
      console.log('Starting download for image URL:', imageUrl.substring(0, 50) + '...');
      
      let downloadUrl = imageUrl;
      
      // Check if this is a Supabase Storage URL
      if (imageUrl.includes('storage/v1/object')) {
        // Try to extract bucket and path to generate a fresh URL
        const storagePathMatch = imageUrl.match(/storage\/v1\/object\/public\/([^\/]+)\/(.+?)(?:\?|$)/);
        
        if (storagePathMatch) {
          const bucketName = storagePathMatch[1];
          let filePath = storagePathMatch[2].split('?')[0]; // Remove query params
          
          console.log(`Generating fresh download URL for: bucket=${bucketName}, path=${filePath}`);
          
          // Get a fresh URL for downloading
          const { data } = await supabase
            .storage
            .from(bucketName)
            .getPublicUrl(filePath);
            
          if (data?.publicUrl) {
            downloadUrl = data.publicUrl;
            console.log('Using fresh Supabase URL:', downloadUrl.substring(0, 50) + '...');
          }
        }
      }
      
      // Now fetch the image with the proper URL
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Create a safe filename from the prompt or use a timestamp
      const safeFileName = prompt 
        ? prompt.substring(0, 20).replace(/[^a-z0-9]/gi, '-').toLowerCase() 
        : `image-${Date.now()}`;
        
      link.download = `${safeFileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
      
      toast.success('Image downloaded successfully');
      console.log('Download completed successfully');
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
