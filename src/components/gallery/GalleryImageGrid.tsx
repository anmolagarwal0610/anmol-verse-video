
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GeneratedImage } from './GalleryTypes';
import ImageCard from '@/components/ImageCard';
import { Copy } from 'lucide-react';
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
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    // Reset loaded and failed states when images array changes
    setLoadedImages(new Set());
    setFailedImages(new Set());
  }, [images]);
  
  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    
    // Remove from failed set if it was previously failed
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };
  
  const handleImageError = (id: string, url: string) => {
    console.error(`Failed to load image ${id} from URL: ${url.substring(0, 50)}...`);
    
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };
  
  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copied to clipboard');
  };
  
  console.log(`Rendering GalleryImageGrid with ${images.length} images`);
  console.log(`Loaded images: ${loadedImages.size}, Failed images: ${failedImages.size}`);

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {images.map((image, index) => (
        <div key={image.id} className="relative group">
          <ImageCard 
            image={{
              ...image,
              // Ensure image URL is valid
              image_url: image.image_url || ''
            }} 
            index={index} 
            onLoad={() => handleImageLoad(image.id)}
            onError={() => handleImageError(image.id, image.image_url || '')}
          />
          
          {/* Actions */}
          <div className="mt-2 flex items-center justify-end">
            <div className="flex">
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
