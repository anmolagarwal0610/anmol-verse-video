
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
  
  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt);
    setIsCopied(true);
    toast.success('Prompt copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const truncatedPrompt = prompt.length > 100
    ? `${prompt.substring(0, 100)}...`
    : prompt;
    
  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground mb-1">Prompt</div>
        <div className="flex items-center justify-between gap-2 group">
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              className="p-0 h-auto font-normal text-sm hover:bg-transparent justify-start text-left w-full"
            >
              <p className="line-clamp-2 text-gray-800 dark:text-gray-200">
                {truncatedPrompt}
              </p>
            </Button>
          </PopoverTrigger>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
            onClick={handleCopyPrompt}
            title="Copy prompt"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            )}
          </Button>
        </div>
      </div>
      
      <PopoverContent className="w-80 shadow-lg" align="start">
        <div className="space-y-2">
          <h4 className="font-medium">Image Prompt</h4>
          <p className="text-sm text-muted-foreground break-words">{prompt}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ImagePromptPopover;
