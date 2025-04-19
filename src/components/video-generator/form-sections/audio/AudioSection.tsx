
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
                  onPointerDownOutside={(e) => {
                    const target = e.target as HTMLElement;
                    const isPlayingAudio = playingVoice !== null;
                    const isPlayButton = target.closest('button') && 
                      (target.closest('button')?.innerHTML.includes('svg') || 
                       target.tagName === 'svg' || 
                       target.tagName === 'path');
                    
                    console.log("🛑 Pointer outside event, target:", target.tagName);
                    console.log("Is audio playing:", isPlayingAudio);
                    
                    if (isPlayingAudio || isPlayButton) {
                      console.log("🛑 Preventing close due to audio playing or play button click");
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6 rounded-full hover:bg-accent"
                      onClick={(e) => {
                        // Allow the dropdown to close when clicking the close button
                        e.stopPropagation();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="space-y-2 py-2">
                      {filteredVoices.map((voice) => (
                        <SelectItem 
                          key={voice.id} 
                          value={voice.id}
                          className="flex items-center justify-between py-3 relative"
                          onSelect={(e) => {
                            // Don't close if clicking play button
                            if (e.target !== e.currentTarget) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <VoiceItem 
                            voice={voice}
                            playingVoice={playingVoice}
                            onPlayPreview={playVoicePreview}
                          />
                        </SelectItem>
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
