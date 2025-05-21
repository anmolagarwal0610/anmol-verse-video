
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface PlayButtonProps {
  onClick: () => void;
}

const PlayButton = ({ onClick }: PlayButtonProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Button 
        size="icon" 
        variant="secondary" // Secondary variant uses new theme colors (dark gray bg, white text)
        // Updated background to use Cool Lilac with opacity, text Cloud White
        className="h-16 w-16 rounded-full bg-[rgba(var(--primary-rgb),0.3)] hover:bg-[rgba(var(--primary-rgb),0.5)] backdrop-blur text-foreground"
        onClick={onClick}
      >
        <Play className="h-8 w-8" />
      </Button>
    </div>
  );
};

export default PlayButton;
