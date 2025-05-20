
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
import VoiceSelectionField from '../simplified/VoiceSelectionField'; // Import VoiceSelectionField

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
        // Find first available voice for the new language
        const newDefaultVoiceForLanguage = Object.values(VOICE_OPTIONS).find(
          v => v.language === currentLanguage
        );
        // Set to the ID of the new default voice, or empty string if no voice is found (though this should be rare)
        form.setValue('voice', newDefaultVoiceForLanguage?.id || '', { shouldDirty: true, shouldValidate: true });
      }
    } else {
      // If no voice is selected, try to set a default one for the current language
      const newDefaultVoiceForLanguage = Object.values(VOICE_OPTIONS).find(
        v => v.language === currentLanguage
      );
      if (newDefaultVoiceForLanguage) {
        form.setValue('voice', newDefaultVoiceForLanguage.id, { shouldDirty: true, shouldValidate: true });
      }
    }
  }, [currentLanguage, form]);

  return (
    <>
      <FormField
        control={form.control}
        name="audio_language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Audio Language</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                // Trigger revalidation or reset of voice when language changes
                // The useEffect above will handle setting a default voice.
              }}
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
      {/* VoiceSelectionField is now part of AdvancedAudioSettingsFields */}
      {/* It will only be rendered if the parent AccordionContent is visible */}
      <VoiceSelectionField /> 
    </>
  );
};

export default AdvancedAudioSettingsFields;
