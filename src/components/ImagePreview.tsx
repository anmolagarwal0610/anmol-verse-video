
import { useState, useEffect } from 'react';
import { Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImagePreviewProps {
  imageUrl: string | null;
  outputFormat: string;
  onDownload: () => void;
}

const ImagePreview = ({ imageUrl, outputFormat, onDownload }: ImagePreviewProps) => {
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
      
      <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button 
          size="sm" 
          variant="secondary" 
          className="bg-white/20 backdrop-blur-sm hover:bg-white/40 border border-purple-300/20"
          onClick={copyImageUrl}
        >
          <Copy className="h-4 w-4 mr-1" /> Copy URL
        </Button>
        <Button 
          size="sm"
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
