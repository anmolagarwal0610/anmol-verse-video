
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
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface VoiceSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVoiceSelect: (voiceId: string) => void;
}

const VoiceSelectionDialog = ({ open, onOpenChange, onVoiceSelect }: VoiceSelectionDialogProps) => {
  const { form, isGenerating } = useVideoGenerationForm();
  const currentLanguage = form.watch('audio_language');
  const currentVoiceInForm = form.watch('voice');
  const [searchTerm, setSearchTerm] = useState('');

  // Local state for the voice selected *within* the dialog before confirmation
  const [selectedVoiceInDialog, setSelectedVoiceInDialog] = useState<string>(currentVoiceInForm);

  // Sync dialog's selected voice with form's voice when dialog opens or form voice changes
  useEffect(() => {
    if (open) {
      setSelectedVoiceInDialog(currentVoiceInForm);
    }
  }, [currentVoiceInForm, open]);

  const allVoicesArray = Object.entries(VOICE_OPTIONS).map(([id, voice]) => ({ ...voice, id }));

  const availableVoices = allVoicesArray
    .filter(voice => voice.language === currentLanguage)
    .filter(voice => 
      voice.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      voice.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleConfirmSelection = () => {
    onVoiceSelect(selectedVoiceInDialog);
    onOpenChange(false); // Close dialog
  };
  
  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
        // Reset search term when dialog closes
        setSearchTerm('');
    }
    onOpenChange(isOpen);
  };


  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[900px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Select a Voice</DialogTitle>
          <DialogDescription>
            Choose a voice for your video. Preview by clicking the play button. <br />
            Current language: <strong>{currentLanguage || 'Not set'}</strong>. 
            {currentLanguage ? '' : ' Select a language in Advanced Configuration > Voice Language.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 pt-4 pb-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search voices by name or category..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <ScrollArea className="flex-grow px-6">
          {availableVoices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-4">
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
              No voices available for "{currentLanguage}"{searchTerm && ` matching "${searchTerm}"`}.
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
