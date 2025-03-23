
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImagePreviewProps {
  imageUrl: string | null;
  outputFormat: string;
  onDownload: () => void;
}

const ImagePreview = ({ imageUrl, outputFormat, onDownload }: ImagePreviewProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);

  // Add escape key listener to close preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPreviewOpen) {
        closePreview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewOpen]);

  // Prevent scroll when preview is open
  useEffect(() => {
    if (isPreviewOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isPreviewOpen]);

  if (!imageUrl) return null;

  return (
    <>
      <div className="group relative w-full h-full flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt="Generated" 
          className="max-w-full max-h-[75vh] object-contain cursor-pointer"
          onClick={openPreview}
        />
        
        <Button 
          size="sm" 
          variant="secondary" 
          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={openPreview}
        >
          <Maximize2 className="h-4 w-4 mr-1" /> Preview
        </Button>
      </div>

      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closePreview} // Close preview when clicking the background
          >
            <motion.div 
              className="relative w-full h-full flex items-center justify-center p-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()} // Prevent clicks on image from bubbling to background
            >
              <img 
                src={imageUrl} 
                alt="Generated full preview" 
                className="max-w-[90%] max-h-[90vh] object-contain"
              />
              
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button 
                  size="icon" 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(imageUrl, '_blank');
                  }}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  <Download className="h-5 w-5" />
                </Button>
                <Button 
                  size="icon" 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    closePreview();
                  }}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImagePreview;
