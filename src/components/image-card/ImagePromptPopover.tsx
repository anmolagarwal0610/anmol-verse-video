
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface ImagePromptPopoverProps {
  prompt: string;
}

const ImagePromptPopover = ({ prompt }: ImagePromptPopoverProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const truncatedPrompt = prompt.length > 25
    ? `${prompt.substring(0, 25)}...`
    : prompt;
    
  return (
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
          <p className="text-sm text-muted-foreground">{prompt}</p>
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
  );
};

export default ImagePromptPopover;
