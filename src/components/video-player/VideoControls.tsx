
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoControlsProps {
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isControlsVisible: boolean;
  videoUrl: string;
  onTogglePlay: () => void;
  onProgressChange: (newValue: number[]) => void;
  onToggleMute: () => void;
  onVolumeChange: (newValue: number[]) => void;
  onReset: () => void;
}

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const VideoControls = ({
  isPlaying,
  progress,
  duration,
  currentTime,
  volume,
  isMuted,
  isControlsVisible,
  videoUrl,
  onTogglePlay,
  onProgressChange,
  onToggleMute,
  onVolumeChange,
  onReset,
}: VideoControlsProps) => {
  return (
    <div 
      className={cn(
        "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300",
        isControlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Progress bar */}
      <div className="mb-4">
        <Slider
          value={[progress]}
          min={0}
          max={100}
          step={0.1}
          onValueChange={onProgressChange}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-white/80 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/10"
            onClick={onTogglePlay}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/10"
            onClick={onReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10"
            onClick={onToggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          <div className="w-20 hidden sm:block">
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={onVolumeChange}
            />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10"
            asChild
          >
            <a href={videoUrl} download>
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;
