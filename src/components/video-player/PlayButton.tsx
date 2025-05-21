
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
        variant="secondary" 
        className="h-16 w-16 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur"
        onClick={onClick}
      >
        <Play className="h-8 w-8" />
      </Button>
    </div>
  );
};

export default PlayButton;
