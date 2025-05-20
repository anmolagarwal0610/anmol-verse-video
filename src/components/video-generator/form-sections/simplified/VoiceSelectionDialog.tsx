import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VoiceItem } from '../audio/VoiceItem';
import { VOICE_OPTIONS } from '@/lib/api';
import { useVideoGenerationForm } from '../../VideoGenerationFormContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AUDIO_LANGUAGES } from '@/lib/video/constants/audio';

interface VoiceSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVoiceSelect: (voiceId: string) => void;
}

const VoiceSelectionDialog = ({ open, onOpenChange, onVoiceSelect }: VoiceSelectionDialogProps) => {
  const { form, isGenerating } = useVideoGenerationForm();
  const currentLanguage = form.watch('audio_language');
  const currentVoiceInForm = form.watch('voice');

  const [selectedVoiceInDialog, setSelectedVoiceInDialog] = useState<string>(currentVoiceInForm);

  useEffect(() => {
    if (open) {
      setSelectedVoiceInDialog(currentVoiceInForm);
    }
  }, [currentVoiceInForm, open]);

  const allVoicesArray = Object.entries(VOICE_OPTIONS).map(([id, voice]) => ({ ...voice, id }));

  const availableVoices = allVoicesArray
    .filter(voice => voice.language === currentLanguage);

  const handleConfirmSelection = () => {
    onVoiceSelect(selectedVoiceInDialog);
    onOpenChange(false);
  };

  const handleLanguageChange = (newLanguage: string) => {
    if (newLanguage && newLanguage !== currentLanguage) {
      form.setValue('audio_language', newLanguage, { shouldDirty: true, shouldValidate: true });
      // The useEffect in AdvancedAudioSettingsFields will handle resetting the voice if incompatible
      // or setting a default voice for the new language.
      // We might also want to clear selectedVoiceInDialog or set it to a default for the new language.
      // For now, let's keep it simple, the confirm button will be disabled if no voice is selected or if the current selection is invalid.
    }
  };

  const languageOptions = Object.values(AUDIO_LANGUAGES);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[900px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Select a Voice</DialogTitle>
          <DialogDescription>
            Choose a voice for your video. Preview by clicking the play button.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4 border-b">
          <label className="text-sm font-medium mb-2 block">Select Language</label>
          <ToggleGroup
            type="single"
            value={currentLanguage}
            onValueChange={handleLanguageChange}
            className="justify-start"
            disabled={isGenerating}
          >
            {languageOptions.map((lang) => (
              <ToggleGroupItem key={lang} value={lang} aria-label={`Toggle ${lang}`}>
                {lang}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
           {currentLanguage ? <p className="text-xs text-muted-foreground mt-1">Showing voices for: <strong>{currentLanguage}</strong></p> : <p className="text-xs text-red-500 mt-1">Select a language to see available voices.</p>}
        </div>
        
        <ScrollArea className="flex-grow px-6 py-4">
          {availableVoices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableVoices.map((voice) => (
                <VoiceItem
                  key={voice.id}
                  voice={voice}
                  voiceId={voice.id}
                  selected={selectedVoiceInDialog === voice.id}
                  onClick={() => setSelectedVoiceInDialog(voice.id)}
                  disabled={isGenerating}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {currentLanguage ? `No voices available for "${currentLanguage}".` : "Please select a language above to see available voices."}
            </p>
          )}
        </ScrollArea>
        <DialogFooter className="mt-auto p-6 pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={isGenerating}>Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleConfirmSelection}
            disabled={!selectedVoiceInDialog || isGenerating || selectedVoiceInDialog === currentVoiceInForm || !availableVoices.find(v => v.id === selectedVoiceInDialog)}
            type="button"
          >
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSelectionDialog;
