
import { useState, useEffect, useRef } from 'react';
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
  const currentLanguageInForm = form.watch('audio_language');
  const currentVoiceInForm = form.watch('voice');

  const [selectedInternalLanguage, setSelectedInternalLanguage] = useState<string>(currentLanguageInForm);
  const [selectedVoiceInDialog, setSelectedVoiceInDialog] = useState<string>(currentVoiceInForm);

  const dialogContentRef = useRef<HTMLDivElement>(null);
  const languageSelectionRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<React.ElementRef<typeof ScrollArea>>(null); 
  const voiceListRef = useRef<HTMLDivElement>(null);

  const allVoicesArray = Object.entries(VOICE_OPTIONS).map(([id, voice]) => ({ ...voice, id }));
  
  const availableVoices = allVoicesArray
    .filter(voice => voice.language === selectedInternalLanguage);

  useEffect(() => {
    if (open) {
      setSelectedInternalLanguage(currentLanguageInForm);
      setSelectedVoiceInDialog(currentVoiceInForm);
      // Removed height calculation and logging logic
    }
  }, [currentLanguageInForm, currentVoiceInForm, open]);

  const handleConfirmSelection = () => {
    if (selectedInternalLanguage !== currentLanguageInForm) {
      form.setValue('audio_language', selectedInternalLanguage, { shouldDirty: true, shouldValidate: true });
    }
    onVoiceSelect(selectedVoiceInDialog);
    onOpenChange(false);
  };

  const handleLanguageToggleChange = (newLanguage: string) => {
    if (newLanguage && newLanguage !== selectedInternalLanguage) {
      setSelectedInternalLanguage(newLanguage);
      const voicesInNewLanguage = allVoicesArray.filter(v => v.language === newLanguage);
      if (voicesInNewLanguage.length > 0) {
        const currentSelectionIsValidForNewLang = voicesInNewLanguage.some(v => v.id === selectedVoiceInDialog);
        if (!currentSelectionIsValidForNewLang) {
          setSelectedVoiceInDialog(voicesInNewLanguage[0].id);
        }
      } else {
        setSelectedVoiceInDialog('');
      }
    }
  };
  
  const languageOptions = Object.values(AUDIO_LANGUAGES);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={dialogContentRef} className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[900px] max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Select a Voice</DialogTitle>
          <DialogDescription>
            Choose a voice for your video. Preview by clicking the play button.
          </DialogDescription>
        </DialogHeader>

        <div ref={languageSelectionRef} className="px-6 py-4 border-b">
          <label className="text-sm font-medium mb-2 block">Select Language</label>
          <ToggleGroup
            type="single"
            value={selectedInternalLanguage}
            onValueChange={handleLanguageToggleChange}
            className="justify-start flex-wrap"
            disabled={isGenerating}
          >
            {languageOptions.map((lang) => (
              <ToggleGroupItem key={lang} value={lang} aria-label={`Toggle ${lang}`} className="mb-1 mr-1">
                {lang}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
           {selectedInternalLanguage ? <p className="text-xs text-muted-foreground mt-1">Showing voices for: <strong>{selectedInternalLanguage}</strong></p> : <p className="text-xs text-red-500 mt-1">Select a language to see available voices.</p>}
        </div>
        
        {/* Changed className here to set an explicit height for the scrollable area */}
        <ScrollArea ref={scrollAreaRef} className="h-[350px]"> {/* আগে ছিল: className="flex-1 min-h-0" */}
          <div ref={voiceListRef} className="p-6">
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
                {selectedInternalLanguage ? `No voices available for "${selectedInternalLanguage}".` : "Please select a language above to see available voices."}
              </p>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={isGenerating}>Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleConfirmSelection}
            disabled={!selectedVoiceInDialog || isGenerating || (selectedVoiceInDialog === currentVoiceInForm && selectedInternalLanguage === currentLanguageInForm) || !availableVoices.find(v => v.id === selectedVoiceInDialog)}
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
