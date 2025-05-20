
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVideoGenerationForm } from '../../VideoGenerationFormContext';
import { VOICE_OPTIONS } from '@/lib/api';
import { useEffect } from 'react';

const AdvancedAudioSettingsFields = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  const currentLanguage = form.watch('audio_language');

  const languages = Array.from(
    new Set(Object.values(VOICE_OPTIONS).map((voice) => voice.language))
  );

  // Effect to update voice if language changes and current voice is not compatible
  useEffect(() => {
    const currentVoiceId = form.getValues('voice');
    if (currentVoiceId) {
      const currentVoiceData = VOICE_OPTIONS[currentVoiceId];
      if (currentVoiceData && currentVoiceData.language !== currentLanguage) {
        const newDefaultVoiceForLanguage = Object.values(VOICE_OPTIONS).find(
          v => v.language === currentLanguage
        );
        form.setValue('voice', newDefaultVoiceForLanguage?.id || '');
      }
    }
  }, [currentLanguage, form]);

  return (
    <FormField
      control={form.control}
      name="audio_language"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Audio Language</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={isGenerating}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select audio language" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            The language for the voiceover. This affects available voices.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AdvancedAudioSettingsFields;
