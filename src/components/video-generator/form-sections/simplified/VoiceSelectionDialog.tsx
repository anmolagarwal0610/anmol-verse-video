
import { useState, useEffect, useRef } from 'react'; // Added useRef
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
import { VOICE_OPTIONS } from '@/lib/api'; // VOICE_OPTIONS is in lib/api
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

  // Refs for logging heights
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const languageSectionRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollAreaContentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSelectedInternalLanguage(currentLanguageInForm);
      setSelectedVoiceInDialog(currentVoiceInForm);

      // Log heights after a short delay to allow layout to settle
      setTimeout(() => {
        console.log('--- VoiceSelectionDialog: Height Diagnostics ---');
        if (dialogContentRef.current) {
          console.log('DialogContent offsetHeight:', dialogContentRef.current.offsetHeight);
          console.log('DialogContent clientHeight:', dialogContentRef.current.clientHeight);
        }
        if (headerRef.current) {
          console.log('Header offsetHeight:', headerRef.current.offsetHeight);
        }
        if (languageSectionRef.current) {
          console.log('LanguageSection offsetHeight:', languageSectionRef.current.offsetHeight);
        }
        if (scrollAreaRef.current) {
          console.log('ScrollArea Component offsetHeight:', scrollAreaRef.current.offsetHeight);
          // Attempt to find the Radix viewport
          const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
          if (viewport) {
            console.log('ScrollArea Viewport offsetHeight:', (viewport as HTMLElement).offsetHeight);
            console.log('ScrollArea Viewport clientHeight:', (viewport as HTMLElement).clientHeight);
            console.log('ScrollArea Viewport scrollHeight (content height inside viewport):', (viewport as HTMLElement).scrollHeight);
          } else {
            console.log('ScrollArea Viewport: Not found via [data-radix-scroll-area-viewport]');
          }
        }
        if (scrollAreaContentRef.current) {
          // This is the direct child we render inside ScrollArea, its height should match Viewport.scrollHeight
          console.log('ScrollArea Inner Content Grid (ref) offsetHeight:', scrollAreaContentRef.current.offsetHeight);
        }
        if (footerRef.current) {
          console.log('Footer offsetHeight:', footerRef.current.offsetHeight);
        }
        console.log('--- End Height Diagnostics ---');
      }, 100);
    }
  }, [open, currentLanguageInForm, currentVoiceInForm, selectedInternalLanguage, availableVoices]); // Added availableVoices as it affects content

  const allVoicesArray = Object.entries(VOICE_OPTIONS).map(([id, voice]) => ({ ...voice, id }));

  const availableVoices = allVoicesArray
    .filter(voice => voice.language === selectedInternalLanguage);

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
        if (!currentSelectionIsValidForNewLang || selectedVoiceInDialog === '') { // Also auto-select if current selection is empty
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
        <DialogHeader ref={headerRef} className="p-6 pb-4">
          <DialogTitle>Select a Voice</DialogTitle>
          <DialogDescription>
            Choose a voice for your video. Preview by clicking the play button.
          </DialogDescription>
        </DialogHeader>

        <div ref={languageSectionRef} className="px-6 pb-4 border-b">
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
        
        <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0 px-6 py-4">
          {availableVoices.length > 0 ? (
            <div ref={scrollAreaContentRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
        </ScrollArea>
        <DialogFooter ref={footerRef} className="p-6 pt-4 border-t">
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
