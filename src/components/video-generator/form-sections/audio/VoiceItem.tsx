
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon } from 'lucide-react';
import { VoiceOption } from '@/lib/video/constants/audio';

interface VoiceItemProps {
  voice: VoiceOption;
  playingVoice: string | null;
  onPlayPreview: (voiceId: string, previewUrl: string, event: React.MouseEvent) => void;
}

export const VoiceItem = ({ voice, playingVoice, onPlayPreview }: VoiceItemProps) => {
  return (
    <div className="flex items-center justify-between w-full pr-2">
      <div>
        <span className="font-medium">{voice.name}</span>
        <span className="text-sm text-muted-foreground"> - {voice.category}</span>
        <div className="text-xs text-muted-foreground">{voice.language}</div>
      </div>
      
      {voice.previewUrl && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full focus:outline-none"
          onClick={(e) => onPlayPreview(voice.id, voice.previewUrl, e)}
          onMouseDown={(e) => {
            console.log("Button mouseDown event");
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {playingVoice === voice.id ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};
