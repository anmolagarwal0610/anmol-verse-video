import { useEffect } from 'react';
import { X } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { useVideoGenerationForm } from '../../VideoGenerationFormContext';
import { AUDIO_LANGUAGES, VOICE_OPTIONS } from '@/lib/video/constants/audio';
import { useAudioPreview } from './hooks/useAudioPreview';
import { VoiceItem } from './VoiceItem';
import * as SelectPrimitive from "@radix-ui/react-select";

const AudioSection = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  const { playingVoice, playVoicePreview } = useAudioPreview();
  
  const selectedLanguage = form.watch('audio_language');
  const filteredVoices = Object.values(VOICE_OPTIONS).filter(
    voice => voice.language === selectedLanguage || voice.id.startsWith('google_')
  );
  
  useEffect(() => {
    console.log("AudioSection mounted with language:", selectedLanguage);
    return () => console.log("AudioSection unmounting");
  }, [selectedLanguage]);

  // Debug function to log events
  const logEvent = (eventName: string, e: React.MouseEvent | React.SyntheticEvent | any) => {
    console.log(`🔍 ${eventName}:`);
    console.log(" - Event type:", e.type);
    console.log(" - Target:", e.target?.tagName);
    console.log(" - Current target:", e.currentTarget?.tagName);
  };
  
  return (
    <div className="space-y-6">
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
      
      <FormField
        control={form.control}
        name="voice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  console.log("Voice selection changed to:", value);
                  field.onChange(value);
                }}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent 
                  className="max-h-[300px] relative z-50"
                  // Use Radix UI's built-in event prevention
                  onCloseAutoFocus={(e) => {
                    // Prevent closing when interacting with voice items
                    if (playingVoice !== null) {
                      e.preventDefault();
                      console.log("Preventing dropdown close due to audio playing");
                    }
                  }}
                >
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6 rounded-full hover:bg-accent"
                      onClick={(e) => {
                        // Allow manual closing via X button
                        logEvent("Close button clicked", e);
                        e.stopPropagation();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="space-y-2 py-2">
                      {filteredVoices.map((voice) => (
                        <div 
                          key={voice.id}
                          className="relative"
                          onClick={(e) => {
                            // Prevent event propagation to keep dropdown open
                            logEvent("Voice item container clicked", e);
                            e.stopPropagation();
                            e.preventDefault();

                            // Select the voice value but don't close dropdown
                            console.log("Setting voice value to:", voice.id);
                            form.setValue('voice', voice.id);
                          }}
                        >
                          <SelectItem 
                            value={voice.id}
                            className="flex items-center justify-between py-3 relative"
                            onSelect={(e) => {
                              // Prevent default selection behavior which causes dropdown to close
                              logEvent("Voice SelectItem onSelect", e);
                              e.preventDefault();
                            }}
                          >
                            <VoiceItem 
                              voice={voice}
                              playingVoice={playingVoice}
                              onPlayPreview={playVoicePreview}
                            />
                          </SelectItem>
                        </div>
                      ))}
                    </div>
                  </div>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Choose the voice for your video's narration
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AudioSection;
