
import { motion } from 'framer-motion';
import { GeneratedImage, truncateText } from './GalleryTypes';
import ImageCard from '@/components/ImageCard';
import { Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface GalleryImageGridProps {
  images: GeneratedImage[];
}

const GalleryImageGrid = ({ images }: GalleryImageGridProps) => {
  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copied to clipboard');
  };

  const handleDownloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create object URL for downloading
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element to trigger download
      const a = document.createElement('a');
      a.href = url;
      // Generate filename based on prompt (or use a default)
      const filename = prompt 
        ? `${prompt.slice(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg` 
        : `image_${new Date().getTime()}.jpg`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Image downloaded successfully');
    } catch (err) {
      console.error('Error downloading image:', err);
      toast.error('Failed to download image');
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {images.map((image, index) => (
        <div key={image.id} className="relative group">
          <ImageCard image={image} index={index} />
          
          {/* Prompt display with copy and download buttons */}
          <div className="mt-2 flex items-start">
            <p className="text-xs text-muted-foreground flex-1">
              {truncateText(image.prompt, 40)}
            </p>
            <div className="flex">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => handleDownloadImage(image.image_url, image.prompt)}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 ml-1"
                      onClick={() => handleCopyPrompt(image.prompt)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy full prompt</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default GalleryImageGrid;
