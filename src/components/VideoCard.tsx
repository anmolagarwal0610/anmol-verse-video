
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Play, Copy, Check } from 'lucide-react';
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

export interface VideoData {
  id: string;
  title?: string;
  prompt: string;
  url: string;
  thumbnail?: string;
  created_at: string;
  user_id?: string;
}

interface VideoCardProps {
  video: VideoData;
  index: number;
}

const VideoCard = ({ video, index }: VideoCardProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
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
  
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(video.prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const formattedDate = video.created_at
    ? format(new Date(video.created_at), 'MMM d, yyyy')
    : 'Unknown date';
  
  const truncatedPrompt = video.prompt.length > 25
    ? `${video.prompt.substring(0, 25)}...`
    : video.prompt;

  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg group">
        <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
            alt={video.title || video.prompt}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm" 
              asChild
            >
              <a href={video.url} target="_blank" rel="noopener noreferrer">
                <Play className="h-8 w-8 text-white" />
              </a>
            </Button>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                <h4 className="font-medium">Video Prompt</h4>
                <p className="text-sm text-muted-foreground">{video.prompt}</p>
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
          
          <div className="text-xs text-muted-foreground mt-2">
            {formattedDate}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default VideoCard;
