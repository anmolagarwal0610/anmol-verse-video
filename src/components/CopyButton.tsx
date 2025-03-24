
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { ButtonProps } from '@/components/ui/button';

export interface CopyButtonProps extends ButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={copyToClipboard}
      {...props}
    >
      {copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span className="sr-only">Copy</span>
    </Button>
  );
}
