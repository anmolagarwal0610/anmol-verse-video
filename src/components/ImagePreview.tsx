
import { useState } from 'react';
import { Download, Copy } from 'lucide-react';
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
  
  if (!imageUrl) return null;

  const copyImageUrl = () => {
    if (!imageUrl) return;
    
    navigator.clipboard.writeText(imageUrl)
      .then(() => toast.success('Image URL copied to clipboard!'))
      .catch(() => toast.error('Failed to copy URL'));
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center group">
      <img 
        src={imageUrl} 
        alt="Generated" 
        className="max-w-full max-h-[75vh] object-contain border border-purple-200/20 rounded-lg shadow-lg"
      />
      
      <div className={`absolute ${isMobile ? 'bottom-2 right-2' : 'bottom-4 right-4'} flex ${isMobile ? 'flex-col space-y-2' : 'space-x-3'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
        <Button 
          size={isMobile ? "sm" : "default"} 
          variant="secondary" 
          className="backdrop-blur-sm bg-white/20 hover:bg-white/40 border border-purple-300/20"
          onClick={copyImageUrl}
        >
          <Copy className="h-4 w-4 mr-1" /> Copy URL
        </Button>
        <Button 
          size={isMobile ? "sm" : "default"}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-1" /> Open
        </Button>
      </div>
    </div>
  );
};

export default ImagePreview;
