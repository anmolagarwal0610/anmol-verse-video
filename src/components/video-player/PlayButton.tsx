
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
        variant="secondary" // Secondary might be Cool Lilac based on new CSS vars
        // Updated button styling
        className="h-16 w-16 rounded-full bg-sky-blue-tint/30 hover:bg-sky-blue-tint/50 backdrop-blur text-cloud-white"
        onClick={onClick}
      >
        <Play className="h-8 w-8" />
      </Button>
    </div>
  );
};

export default PlayButton;
