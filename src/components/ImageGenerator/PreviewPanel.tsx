
import { useState } from 'react';
import { Loader2, ImageIcon, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImagePreview from '@/components/ImagePreview';
import { toast } from 'sonner';

interface PreviewPanelProps {
  isGenerating: boolean;
  imageUrl: string | null;
  outputFormat: 'jpeg' | 'png';
}

const PreviewPanel = ({ isGenerating, imageUrl, outputFormat }: PreviewPanelProps) => {
  const downloadImage = async () => {
    if (!imageUrl) return;
    
    // Open the image in a new tab
    window.open(imageUrl, '_blank');
    toast.success('Image opened in new tab');
  };
  
  const copyImageUrl = () => {
    if (!imageUrl) return;
    
    navigator.clipboard.writeText(imageUrl)
      .then(() => toast.success('Image URL copied to clipboard!'))
      .catch(() => toast.error('Failed to copy URL'));
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden min-h-[500px]">
      {isGenerating ? (
        <div className="text-center p-8">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Generating your image...</p>
        </div>
      ) : imageUrl ? (
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <ImagePreview 
            imageUrl={imageUrl} 
            outputFormat={outputFormat} 
            onDownload={downloadImage} 
          />
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={copyImageUrl}
            >
              <Copy className="h-4 w-4 mr-1" /> Copy URL
            </Button>
            <Button 
              size="sm" 
              onClick={downloadImage}
            >
              <Download className="h-4 w-4 mr-1" /> Open
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center p-8">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Your generated image will appear here</p>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;
