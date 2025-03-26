
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import {
  TooltipProvider,
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PromptButtonProps {
  prompt: string;
}

const PromptButton = ({ prompt }: PromptButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  return (
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
  );
};

export default PromptButton;
