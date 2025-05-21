
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react'; // Ensure Play icon is available

interface PlayButtonProps {
  onClick: () => void;
}

const PlayButton = ({ onClick }: PlayButtonProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Button 
        size="icon" 
        // Button styling: Semi-transparent Sky Blue Tint, hover to more opaque Light Cyan
        className="h-16 w-16 rounded-full bg-sky-blue-tint/70 hover:bg-light-cyan/90 backdrop-blur-sm text-off-black shadow-lg"
        onClick={onClick}
      >
        <Play className="h-8 w-8 fill-current" /> {/* fill-current to use text-off-black */}
      </Button>
    </div>
  );
};

export default PlayButton;
