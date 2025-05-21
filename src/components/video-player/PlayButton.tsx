
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
        variant="secondary" // Secondary variant will now use new theme colors
        // Added primary color with opacity for the button background
        className="h-16 w-16 rounded-full bg-primary/30 hover:bg-primary/50 backdrop-blur text-primary-foreground"
        onClick={onClick}
      >
        <Play className="h-8 w-8" />
      </Button>
    </div>
  );
};

export default PlayButton;
