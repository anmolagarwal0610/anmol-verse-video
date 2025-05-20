
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
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

const VoiceSelectionField = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  const currentLanguage = form.watch('audio_language');

  const availableVoices = Object.values(VOICE_OPTIONS).filter(
    (voice) => voice.language === currentLanguage
  );

  return (
    <FormField
      control={form.control}
      name="voice"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Voice <span className="text-red-500">*</span></FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={isGenerating || availableVoices.length === 0}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {availableVoices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {availableVoices.length === 0 && currentLanguage && (
            <p className="text-sm text-muted-foreground">
              No voices available for the selected language. Please choose a language in Advanced Configuration.
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VoiceSelectionField;
