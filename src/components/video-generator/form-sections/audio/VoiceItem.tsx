
import { Button } from '@/components/ui/button';
import { VoiceOption } from '@/lib/video/constants/audio';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon } from 'lucide-react';

// Create a static audio controller that will be shared across all VoiceItem components
const audioController = {
  currentAudio: null as HTMLAudioElement | null,
  currentVoiceId: null as string | null,
  
  play(audio: HTMLAudioElement, voiceId: string) {
    // If there's already an audio playing, stop it first
    if (this.currentAudio && this.currentAudio !== audio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    
    // Set the new current audio and play it
    this.currentAudio = audio;
    this.currentVoiceId = voiceId;
    audio.play();
  },
  
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
      this.currentVoiceId = null;
    }
  },
  
  isPlaying(voiceId: string) {
    return this.currentVoiceId === voiceId && 
           this.currentAudio && 
           !this.currentAudio.paused;
  }
};

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

  // Update local playing state based on the global audio controller
  useEffect(() => {
    const updatePlayingState = () => {
      setIsPlaying(audioController.isPlaying(voiceId));
    };
    
    // Set up interval to check playing status
    const intervalId = setInterval(updatePlayingState, 100);
    
    // Clean up interval on unmount
    return () => {
      clearInterval(intervalId);
      
      // If this component's audio is currently playing when unmounted, stop it
      if (audioController.isPlaying(voiceId)) {
        audioController.stop();
      }
    };
  }, [voiceId]);
  
  const handlePlayPreview = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!voice.previewUrl) return;
    
    if (isPlaying) {
      // If this voice is currently playing, stop it
      audioController.stop();
      setIsPlaying(false);
      return;
    }
    
    // Create new audio instance if needed
    let audioElement = audio;
    if (!audioElement) {
      audioElement = new Audio(voice.previewUrl);
      audioElement.onended = () => {
        setIsPlaying(false);
      };
      setAudio(audioElement);
    }
    
    // Play the audio using the controller
    audioController.play(audioElement, voiceId);
    setIsPlaying(true);
  };
  
  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-md cursor-pointer touch-manipulation ${
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
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200">
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
