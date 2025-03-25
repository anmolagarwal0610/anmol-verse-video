
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Loader2, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export interface ImageData {
  id: string;
  prompt: string;
  image_url: string;
  width: number;
  height: number;
  created_at: string;
  preferences?: string[];
  model: string;
  user_id?: string;
}

interface ImageCardProps {
  image: ImageData;
  index: number;
}

const ImageCard = ({ image, index }: ImageCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formattedDate = image.created_at
    ? format(new Date(image.created_at), 'MMM d, yyyy')
    : 'Unknown date';
    
  const truncatedPrompt = image.prompt.length > 25
    ? `${image.prompt.substring(0, 25)}...`
    : image.prompt;
    
  return (
    <motion.div
      className="h-full"
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg group">
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          )}
          <img
            src={image.image_url}
            alt={image.prompt}
            onLoad={handleImageLoad}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-3 flex-grow flex flex-col justify-between">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <div className="flex items-start justify-between">
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 text-left justify-start font-normal hover:bg-transparent"
                >
                  <p className="text-sm font-medium line-clamp-1">{truncatedPrompt}</p>
                </Button>
              </PopoverTrigger>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1 shrink-0"
                      onClick={handleCopyPrompt}
                    >
                      {isCopied ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isCopied ? 'Copied!' : 'Copy prompt'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <PopoverContent side="bottom" align="start" className="max-w-xs">
              <div className="space-y-2">
                <h4 className="font-medium">Image Prompt</h4>
                <p className="text-sm text-muted-foreground">{image.prompt}</p>
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={handleCopyPrompt}
                  >
                    {isCopied ? 'Copied!' : 'Copy prompt'}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
            <div className="flex items-center space-x-1">
              {image.preferences?.map((pref, i) => (
                <span
                  key={i}
                  className="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full px-2 py-0.5 text-[10px]"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ImageCard;
