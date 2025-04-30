
import { Button } from '@/components/ui/button';
import { VoiceOption } from '@/lib/video/constants/audio';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { PlayIcon, PauseIcon } from 'lucide-react';

interface VoiceItemProps {
  voice: VoiceOption;
  voiceId: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const VoiceItem = ({ voice, voiceId, selected, onClick, disabled = false }: VoiceItemProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  const isGoogleVoice = voiceId.startsWith('google_');
  
  const handlePlayPreview = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!voice.previewUrl) return;
    
    if (isPlaying && audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      return;
    }
    
    const newAudio = new Audio(voice.previewUrl);
    newAudio.onended = () => setIsPlaying(false);
    newAudio.play();
    setIsPlaying(true);
    setAudio(newAudio);
  };
  
  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
        selected ? 'bg-primary/10 border border-primary/50' : 'hover:bg-muted/50'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : onClick}
      role="button"
      aria-pressed={selected}
      tabIndex={disabled ? -1 : 0}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{voice.name}</span>
          {!isGoogleVoice && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
              Premium
            </Badge>
          )}
        </div>
        <span className="text-sm text-muted-foreground"> - {voice.category}</span>
        <div className="text-xs text-muted-foreground">{voice.language}</div>
      </div>
      
      {voice.previewUrl && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full touch-manipulation flex-shrink-0"
          onClick={handlePlayPreview}
          disabled={disabled}
        >
          {isPlaying ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};
