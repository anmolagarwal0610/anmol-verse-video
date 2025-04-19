
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useVideoGenerationForm } from '../../VideoGenerationFormContext';
import { AUDIO_LANGUAGES, VOICE_OPTIONS } from '@/lib/video/constants/audio';
import { useAudioPreview } from './hooks/useAudioPreview';
import { VoiceItem } from './VoiceItem';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AudioSection = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  const { playingVoice, playVoicePreview } = useAudioPreview();
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);
  
  const selectedLanguage = form.watch('audio_language');
  const selectedVoice = form.watch('voice');
  
  const filteredVoices = Object.values(VOICE_OPTIONS).filter(
    voice => voice.language === selectedLanguage || voice.id.startsWith('google_')
  );

  const selectedVoiceDetails = VOICE_OPTIONS[selectedVoice];
  
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="audio_language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Audio Language</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  
                  const voicesForLanguage = Object.values(VOICE_OPTIONS).filter(
                    voice => voice.language === value
                  );
                  
                  if (voicesForLanguage.length > 0) {
                    form.setValue('voice', voicesForLanguage[0].id);
                  }
                }}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select audio language" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AUDIO_LANGUAGES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Choose the language for your video's narration
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="voice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice</FormLabel>
            <FormControl>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setVoiceDialogOpen(true)}
                  disabled={isGenerating}
                >
                  <span>{selectedVoiceDetails?.name || 'Select a voice'}</span>
                </Button>
              </div>
            </FormControl>
            <FormDescription>
              Choose the voice for your video's narration
            </FormDescription>
            <FormMessage />

            <Dialog open={voiceDialogOpen} onOpenChange={setVoiceDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Select a Voice</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {filteredVoices.map((voice) => (
                    <div 
                      key={voice.id}
                      className="relative rounded-lg border p-4 hover:bg-accent transition-colors"
                      onClick={() => {
                        form.setValue('voice', voice.id);
                      }}
                    >
                      <VoiceItem 
                        voice={voice}
                        playingVoice={playingVoice}
                        onPlayPreview={playVoicePreview}
                      />
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </FormItem>
        )}
      />
    </div>
  );
};

export default AudioSection;
