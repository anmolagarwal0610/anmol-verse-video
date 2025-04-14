
import { useState, useRef, useEffect } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlayIcon, PauseIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoGenerationForm } from '../VideoGenerationFormContext';
import { AUDIO_LANGUAGES, VOICE_OPTIONS } from '@/lib/videoGenerationApi';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AudioSection = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Filter voices based on selected audio language
  const selectedLanguage = form.watch('audio_language');
  const filteredVoices = Object.values(VOICE_OPTIONS).filter(
    voice => voice.language === selectedLanguage
  );

  // Use effect to log component lifecycle
  useEffect(() => {
    console.log("AudioSection component mounted or updated");
    
    // Cleanup function
    return () => {
      console.log("AudioSection component will unmount");
      if (audioRef.current) {
        console.log("Cleaning up audio on unmount");
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  const playVoicePreview = (voiceId: string, event: React.MouseEvent) => {
    console.log("🔊 Voice preview button clicked for voice ID:", voiceId);
    
    // This is crucial - stop propagation to prevent the dropdown from closing
    event.preventDefault();
    event.stopPropagation();
    
    // Log the event object to see what's happening
    console.log("Event object:", {
      target: event.target,
      currentTarget: event.currentTarget,
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      defaultPrevented: event.defaultPrevented
    });
    
    // Stop currently playing audio if any
    if (audioRef.current) {
      console.log("Stopping currently playing audio");
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // If clicking the same voice that's already playing, just stop it
    if (playingVoice === voiceId) {
      console.log("Stopping current voice as it was already playing");
      setPlayingVoice(null);
      return;
    }
    
    // Play the selected voice preview
    const voice = VOICE_OPTIONS[voiceId];
    console.log("Selected voice details:", voice);
    
    if (voice && voice.previewUrl) {
      console.log("Creating new Audio object with URL:", voice.previewUrl);
      
      try {
        const audio = new Audio(voice.previewUrl);
        audioRef.current = audio;
        
        // Add event listeners to track loading state
        audio.addEventListener('loadstart', () => console.log("Audio loading started"));
        audio.addEventListener('canplaythrough', () => console.log("Audio can play through"));
        audio.addEventListener('error', (e) => {
          console.error("Audio error event:", e);
          const error = audio.error;
          if (error) {
            console.error("Audio error code:", error.code, "message:", error.message);
          }
          setPlayingVoice(null);
          toast.error(`Failed to play voice preview: ${error?.message || 'Unknown error'}`);
        });
        
        console.log("Attempting to play audio...");
        
        // Set a timeout to see if the dropdown closes before audio plays
        setTimeout(() => {
          console.log("Delayed audio play attempt (after 50ms)");
          
          audio.play().then(() => {
            console.log("✅ Audio playback started successfully");
            setPlayingVoice(voiceId);
          }).catch(err => {
            console.error("❌ Error playing voice preview:", err);
            toast.error(`Failed to play voice preview: ${err.message}`);
            setPlayingVoice(null);
          });
        }, 50);
        
        audio.onended = () => {
          console.log("Audio playback ended");
          setPlayingVoice(null);
          audioRef.current = null;
        };
      } catch (err) {
        console.error("❌ Error creating audio object:", err);
        toast.error(`Failed to create audio: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } else {
      console.error("Voice data or preview URL is missing for voice ID:", voiceId);
      toast.error("Voice preview not available");
    }
  };
  
  // Create a custom VoiceItem component for better control
  const VoiceItem = ({ voice }: { voice: typeof VOICE_OPTIONS[keyof typeof VOICE_OPTIONS] }) => {
    return (
      <div className="flex items-center justify-between w-full pr-2">
        <div>
          <span className="font-medium">{voice.name}</span>
          <span className="text-sm text-muted-foreground"> - {voice.category}</span>
          <div className="text-xs text-muted-foreground">{voice.language}</div>
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full focus:outline-none"
          onClick={(e) => playVoicePreview(voice.id, e)}
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
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Audio Language */}
      <FormField
        control={form.control}
        name="audio_language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Audio Language</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  
                  // When language changes, select the first voice of that language
                  const voicesForLanguage = Object.values(VOICE_OPTIONS).filter(
                    voice => voice.language === value
                  );
                  
                  if (voicesForLanguage.length > 0) {
                    form.setValue('voice', voicesForLanguage[0].id);
                  }
                }}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select audio language" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AUDIO_LANGUAGES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Choose the language for your video's narration
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Voice */}
      <FormField
        control={form.control}
        name="voice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice</FormLabel>
            <FormControl>
              <div className="relative">
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    console.log("Voice selection changed to:", value);
                    // Stop any currently playing audio when changing voice
                    if (audioRef.current) {
                      audioRef.current.pause();
                      audioRef.current = null;
                      setPlayingVoice(null);
                    }
                    field.onChange(value);
                  }}
                  disabled={isGenerating}
                  onOpenChange={(open) => {
                    console.log("Select dropdown " + (open ? "opened" : "closed"));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {filteredVoices.map((voice) => (
                      <SelectItem 
                        key={voice.id} 
                        value={voice.id}
                        className="flex items-center justify-between py-3 relative"
                        // This is a hack to prevent the dropdown from closing
                        onSelect={(e) => {
                          if (e.target !== e.currentTarget) {
                            console.log("Prevented select from closing due to child element click");
                            e.preventDefault();
                          }
                        }}
                      >
                        <VoiceItem voice={voice} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FormControl>
            <FormDescription>
              Choose the voice for your video's narration
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Alternative implementation using DropdownMenu for voice selection */}
      {false && ( // Disabled for now, but could be enabled if the Select approach doesn't work
        <FormField
          control={form.control}
          name="voice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voice (Alternative)</FormLabel>
              <FormControl>
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                        disabled={isGenerating}
                      >
                        {field.value ? VOICE_OPTIONS[field.value]?.name || 'Select voice' : 'Select voice'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 max-h-[300px] overflow-auto">
                      {filteredVoices.map((voice) => (
                        <div 
                          key={voice.id}
                          className="flex items-center justify-between p-2 cursor-pointer hover:bg-accent rounded-md"
                          onClick={() => {
                            console.log("Dropdown item clicked for voice:", voice.id);
                            field.onChange(voice.id);
                          }}
                        >
                          <div>
                            <div className="font-medium">{voice.name}</div>
                            <div className="text-sm text-muted-foreground">{voice.category}</div>
                            <div className="text-xs text-muted-foreground">{voice.language}</div>
                          </div>
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={(e) => playVoicePreview(voice.id, e)}
                          >
                            {playingVoice === voice.id ? (
                              <PauseIcon className="h-4 w-4" />
                            ) : (
                              <PlayIcon className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </FormControl>
              <FormDescription>
                Choose the voice for your video's narration
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default AudioSection;
