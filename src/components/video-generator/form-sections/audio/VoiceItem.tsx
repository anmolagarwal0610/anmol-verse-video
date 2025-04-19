
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon } from 'lucide-react';
import { VoiceOption } from '@/lib/video/constants/audio';
import { Badge } from '@/components/ui/badge';

interface VoiceItemProps {
  voice: VoiceOption;
  playingVoice: string | null;
  onPlayPreview: (voiceId: string, previewUrl: string, event: React.MouseEvent) => void;
}

export const VoiceItem = ({ voice, playingVoice, onPlayPreview }: VoiceItemProps) => {
  const isGoogleVoice = voice.id.startsWith('google_');

  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{voice.name}</span>
          {!isGoogleVoice && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
              High Quality
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
          className="h-8 w-8 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onPlayPreview(voice.id, voice.previewUrl, e);
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

