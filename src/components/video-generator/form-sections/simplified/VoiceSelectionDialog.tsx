
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
// Removed Search icon and Input component import

interface VoiceSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVoiceSelect: (voiceId: string) => void;
}

const VoiceSelectionDialog = ({ open, onOpenChange, onVoiceSelect }: VoiceSelectionDialogProps) => {
  const { form, isGenerating } = useVideoGenerationForm();
  const currentLanguage = form.watch('audio_language');
  const currentVoiceInForm = form.watch('voice');
  // Removed searchTerm state

  const [selectedVoiceInDialog, setSelectedVoiceInDialog] = useState<string>(currentVoiceInForm);

  useEffect(() => {
    if (open) {
      setSelectedVoiceInDialog(currentVoiceInForm);
    }
  }, [currentVoiceInForm, open]);

  const allVoicesArray = Object.entries(VOICE_OPTIONS).map(([id, voice]) => ({ ...voice, id }));

  const availableVoices = allVoicesArray
    .filter(voice => voice.language === currentLanguage);
  // Removed filtering by searchTerm

  const handleConfirmSelection = () => {
    onVoiceSelect(selectedVoiceInDialog);
    onOpenChange(false); 
  };
  
  // Simplified onOpenChange handling, no need to reset search term
  // const handleDialogClose = (isOpen: boolean) => {
  //   onOpenChange(isOpen);
  // };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[900px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4"> {/* Adjusted padding */}
          <DialogTitle>Select a Voice</DialogTitle>
          <DialogDescription>
            Choose a voice for your video. Preview by clicking the play button. <br />
            Current language: <strong>{currentLanguage || 'Not set'}</strong>. 
            {currentLanguage ? '' : ' Select a language in Advanced Configuration > Voice Language.'}
          </DialogDescription>
        </DialogHeader>
        
        {/* Removed search input section */}

        <ScrollArea className="flex-grow px-6 py-4"> {/* Added py-4 for spacing */}
          {availableVoices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"> {/* Removed py-4 from here as added to ScrollArea */}
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
              No voices available for "{currentLanguage}".
              {/* Removed searchTerm specific message part */}
            </p>
          )}
        </ScrollArea>
        <DialogFooter className="mt-auto p-6 pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleConfirmSelection} 
            disabled={!selectedVoiceInDialog || isGenerating || selectedVoiceInDialog === currentVoiceInForm}
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
