
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';

interface ImagePromptPopoverProps {
  prompt: string;
}

const ImagePromptPopover = ({ prompt }: ImagePromptPopoverProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setIsCopied(true);
    toast.success('Prompt copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const truncatedPrompt = prompt.length > 60
    ? `${prompt.substring(0, 60)}...`
    : prompt;
    
  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <div className="flex items-center justify-between gap-2">
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            className="p-0 h-auto font-normal hover:bg-transparent justify-start text-left"
          >
            <p className="text-sm line-clamp-2">{truncatedPrompt}</p>
          </Button>
        </PopoverTrigger>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={handleCopyPrompt}
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">Image Prompt</h4>
          <p className="text-sm text-muted-foreground break-words">{prompt}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ImagePromptPopover;
