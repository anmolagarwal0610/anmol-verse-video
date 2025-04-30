
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VOICE_OPTIONS } from '@/lib/video/constants/audio';
import { VoiceItem } from './VoiceItem';
import { useVideoGenerationForm } from '../../VideoGenerationFormContext';
import { SelectBox } from '@/components/shared/SelectBox';
import { AUDIO_LANGUAGES } from '@/lib/video/constants/audio';

const AudioSection = () => {
  const {
    form,
    isGenerating
  } = useVideoGenerationForm();
  
  const audioLanguage = form.watch('audio_language');
  const selectedVoice = form.watch('voice');

  // Filter voices by selected language
  const filteredVoices = Object.entries(VOICE_OPTIONS).filter(([_, voice]) => voice.language === audioLanguage);

  // Determine if the selected voice is a Google voice
  const isGoogleVoice = selectedVoice?.startsWith('google_');
  
  return <div className="space-y-6">
      {/* Language selection */}
      <FormField control={form.control} name="audio_language" render={({
      field
    }) => <FormItem>
            <FormLabel>Audio Language</FormLabel>
            <FormControl>
              <SelectBox
                value={field.value}
                onChange={field.onChange}
                disabled={isGenerating}
                options={AUDIO_LANGUAGES}
                placeholder="Select language"
              />
            </FormControl>
            <FormDescription>
              Select the language for your video's audio
            </FormDescription>
            <FormMessage />
          </FormItem>} />
      
      {/* Voice selection */}
      <FormField control={form.control} name="voice" render={({
      field
    }) => <FormItem>
            <FormLabel>Voice</FormLabel>
            <FormControl>
              <ScrollArea className="h-[240px] border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                  {filteredVoices.map(([voiceId, voice]) => (
                    <VoiceItem 
                      key={voiceId} 
                      selected={field.value === voiceId} 
                      onClick={() => field.onChange(voiceId)} 
                      voice={voice} 
                      voiceId={voiceId} 
                      disabled={isGenerating}
                    />
                  ))}
                </div>
              </ScrollArea>
            </FormControl>
            <FormMessage />
          </FormItem>} />
    </div>;
};

export default AudioSection;
