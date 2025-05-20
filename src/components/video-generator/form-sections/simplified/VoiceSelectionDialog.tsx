
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
  const headerRef = useRef<HTMLDivElement>(null); // Will remain null if not attached
  const languageSelectionRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<React.ElementRef<typeof ScrollArea>>(null); // Correct type for ScrollArea ref
  const voiceListRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null); // Will remain null if not attached

  const allVoicesArray = Object.entries(VOICE_OPTIONS).map(([id, voice]) => ({ ...voice, id }));
  
  const availableVoices = allVoicesArray
    .filter(voice => voice.language === selectedInternalLanguage);

  useEffect(() => {
    if (open) {
      setSelectedInternalLanguage(currentLanguageInForm);
      setSelectedVoiceInDialog(currentVoiceInForm);
      
      setTimeout(() => {
        console.log('DialogContent height:', dialogContentRef.current?.offsetHeight);
        // headerRef.current will be null, so headerRef.current?.offsetHeight will be undefined
        console.log('Header height:', headerRef.current?.offsetHeight); 
        console.log('LanguageSelection height:', languageSelectionRef.current?.offsetHeight);
        console.log('ScrollArea available height (ScrollArea element itself):', scrollAreaRef.current?.offsetHeight);
        // To get viewport height of ScrollArea, you might need to inspect its children if direct access isn't straightforward.
        // For now, let's log the voice list wrapper if needed for content height.
        console.log('VoiceList (content wrapper) height:', voiceListRef.current?.offsetHeight);
        // footerRef.current will be null
        console.log('Footer height:', footerRef.current?.offsetHeight);
        
        if (dialogContentRef.current && languageSelectionRef.current && headerRef.current && footerRef.current) {
           // This calculation might be less accurate now since headerRef and footerRef won't provide height
           const headerH = headerRef.current?.offsetHeight || 0; // Default to 0 if not available
           const footerH = footerRef.current?.offsetHeight || 0; // Default to 0
           const langSelectionH = languageSelectionRef.current?.offsetHeight || 0;

          if (dialogContentRef.current && languageSelectionRef.current) { // Check for refs that are actually attached
            const availableHeightForScroll = dialogContentRef.current.offsetHeight - 
                                            headerH - // Will be 0
                                            langSelectionH - 
                                            footerH; // Will be 0
            console.log('Calculated available height for ScrollArea (approximate):', availableHeightForScroll);
          }
        } else {
            console.log('One or more refs for height calculation are null. Refs status:', {
                dialogContent: !!dialogContentRef.current,
                header: !!headerRef.current, // Expected to be false
                languageSelection: !!languageSelectionRef.current,
                footer: !!footerRef.current, // Expected to be false
            });
        }
      }, 100);
    }
  }, [currentLanguageInForm, currentVoiceInForm, open]);

  const allVoicesArray = Object.entries(VOICE_OPTIONS).map(([id, voice]) => ({ ...voice, id }));

  // Moved availableVoices declaration up
  const availableVoices = allVoicesArray
    .filter(voice => voice.language === selectedInternalLanguage);

  const handleConfirmSelection = () => {
    // Update form language only if it has changed in the dialog
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
      {/* DialogContent is a flex container, column direction, with max height. p-0 and gap-0 to remove default padding/gap if children handle it. */}
      <DialogContent ref={dialogContentRef} className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[900px] max-h-[90vh] flex flex-col p-0 gap-0">
        {/* DialogHeader does NOT accept ref. Removed ref={headerRef} */}
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Select a Voice</DialogTitle>
          <DialogDescription>
            Choose a voice for your video. Preview by clicking the play button.
          </DialogDescription>
        </DialogHeader>

        {/* This div is for language selection, it has a fixed height based on its content. */}
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
        
        {/* ScrollArea needs to take the remaining vertical space. flex-1 and min-h-0 allow it to shrink and grow. */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0">
          {/* This inner div is for padding the content inside the scroll area. */}
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

        {/* DialogFooter does NOT accept ref. Removed ref={footerRef} */}
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
