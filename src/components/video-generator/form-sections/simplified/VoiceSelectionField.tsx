
import { useState } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useVideoGenerationForm } from '../../VideoGenerationFormContext';
import VoiceSelectionDialog from './VoiceSelectionDialog';
import { VOICE_OPTIONS } from '@/lib/api';
import { ChevronDown } from 'lucide-react';

const VoiceSelectionField = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const currentVoiceId = form.watch('voice');
  const currentLanguage = form.watch('audio_language');

  const selectedVoiceDetails = VOICE_OPTIONS[currentVoiceId];

  const handleVoiceSelect = (voiceId: string) => {
    form.setValue('voice', voiceId, { shouldDirty: true, shouldValidate: true });
  };
  
  const hasVoicesForCurrentLanguage = Object.values(VOICE_OPTIONS).some(
    (voice) => voice.language === currentLanguage
  );

  return (
    <FormField
      control={form.control}
      name="voice"
      render={() => ( 
        <FormItem>
          <FormLabel>Voice <span className="text-red-500">*</span></FormLabel>
          <FormControl>
            <Button
              variant="outline"
              className="w-full justify-between text-left font-normal"
              onClick={() => setIsDialogOpen(true)}
              disabled={isGenerating || !currentLanguage || !hasVoicesForCurrentLanguage}
              type="button"
            >
              <span className="truncate pr-2">
                {selectedVoiceDetails ? `${selectedVoiceDetails.name} (${selectedVoiceDetails.category})` : "Select a voice..."}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
            </Button>
          </FormControl>
          {!currentLanguage ? (
            <p className="text-sm text-muted-foreground">
              Please select an audio language in Advanced Configuration to enable voice selection.
            </p>
          ) : !hasVoicesForCurrentLanguage && (
            <p className="text-sm text-muted-foreground">
              No voices available for "{currentLanguage}". Please choose another language in Advanced Configuration.
            </p>
          )}
          <FormMessage />
          {currentLanguage && hasVoicesForCurrentLanguage && (
            <VoiceSelectionDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onVoiceSelect={handleVoiceSelect}
            />
          )}
        </FormItem>
      )}
    />
  );
};

export default VoiceSelectionField;
