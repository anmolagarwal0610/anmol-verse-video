
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import PromptButton from './PromptButton';

interface PromptPopoverProps {
  prompt: string;
  truncatedPrompt: string;
}

const PromptPopover = ({ prompt, truncatedPrompt }: PromptPopoverProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
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

        <PromptButton prompt={prompt} />
      </div>
      
      <PopoverContent side="bottom" align="start" className="max-w-xs">
        <div className="space-y-2">
          <h4 className="font-medium">Video Prompt</h4>
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

export default PromptPopover;
