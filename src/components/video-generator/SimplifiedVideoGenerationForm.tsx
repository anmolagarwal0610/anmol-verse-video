import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { IMAGE_MODELS, VOICE_OPTIONS } from '@/lib/api';
import { VideoGenerationParams } from '@/lib/video/types';
import { VideoGenerationFormProvider } from '@/components/video-generator/VideoGenerationFormContext';
import VideoGenerationConfirmDialog from './dialogs/VideoGenerationConfirmDialog';
import { useVideoGenerationFormSubmit } from './hooks/useVideoGenerationFormSubmit';
import { PIXEL_OPTIONS } from '@/lib/constants/pixelOptions';
import { Settings } from 'lucide-react';
import { useState } from 'react';

// Simplified and Advanced Form Sections
import TopicField from './form-sections/basic/TopicField';
import ImageStyleField from './form-sections/simplified/ImageStyleField';
import VoiceSelectionField from './form-sections/simplified/VoiceSelectionField';

import AdvancedBasicSettingsFields from './form-sections/advanced/AdvancedBasicSettingsFields';
import TimingFields from './form-sections/basic/TimingFields';
import AdvancedVisualsSettingsFields from './form-sections/advanced/AdvancedVisualsSettingsFields';
import AdvancedAudioSettingsFields from './form-sections/advanced/AdvancedAudioSettingsFields';
import SubtitlesSection from './form-sections/SubtitlesSection';

interface SimplifiedVideoGenerationFormProps {
  onSubmit: (data: VideoGenerationParams) => void;
  isGenerating: boolean;
}

const SimplifiedVideoGenerationForm = ({
  onSubmit,
  isGenerating,
}: SimplifiedVideoGenerationFormProps) => {
  const defaultVoice = Object.values(VOICE_OPTIONS).find(voice => voice.language === 'English')?.id || Object.keys(VOICE_OPTIONS)[0];
  let restoredTopic = '';
  try {
    restoredTopic = sessionStorage.getItem('lastVideoTopic') || '';
  } catch (e) {
    // ignore
  }

  const form = useForm<VideoGenerationParams>({
    defaultValues: {
      script_model: 'chatgpt',
      topic: restoredTopic || '',
      image_model: IMAGE_MODELS.advanced.value,
      image_ratio: '16:9',
      image_pixel: PIXEL_OPTIONS['1080p'],
      pixelOption: '1080p',
      video_duration: 25,
      frame_fps: 5,
      subtitle_color: 'white',
      subtitle_font: 'Arial',
      video_category: 'Hollywood Script',
      transition_style: 'fade',
      image_style: [], 
      audio_language: 'English',
      voice: defaultVoice,
      subtitle_style: 'Default',
      subtitle_script: 'English',
    },
  });

  const audioLanguage = form.watch('audio_language');
  const selectedVoice = form.watch('voice');
  const videoDuration = form.watch('video_duration');
  const frameFPS = form.watch('frame_fps');

  const [advancedAccordionValue, setAdvancedAccordionValue] = useState<string | undefined>('');

  const {
    showConfirmDialog,
    setShowConfirmDialog,
    validateAndShowConfirmation,
    handleConfirmedSubmit,
    formData,
    calculateCreditCost,
    isCheckingCredits,
    hasSufficientCredits,
  } = useVideoGenerationFormSubmit({ onSubmit });

  const creditCost = calculateCreditCost({
    ...form.getValues(),
    voice: selectedVoice,
    video_duration: videoDuration,
    frame_fps: frameFPS,
  });

  const isAdvancedAccordionOpen = advancedAccordionValue === "advanced-options";

  return (
    <Card className="w-full shadow-xl border-purple-200/30 bg-gradient-to-br from-slate-50/80 to-purple-50/60 dark:from-slate-900/80 dark:to-purple-950/60 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Create Your Video
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Start with the essentials, then fine-tune with advanced options if you like.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VideoGenerationFormProvider value={{ form, isGenerating }}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(validateAndShowConfirmation)} className="space-y-8">
              {/* Prominent Fields */}
              <Card className="shadow-md bg-white/70 dark:bg-slate-800/70">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Key Ingredients</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <TopicField />
                  <ImageStyleField />
                  {!isAdvancedAccordionOpen && <VoiceSelectionField />} 
                </CardContent>
              </Card>

              {/* Advanced Options Accordion */}
              <Accordion 
                type="single" 
                collapsible 
                className="w-full"
                value={advancedAccordionValue}
                onValueChange={setAdvancedAccordionValue}
              >
                <AccordionItem value="advanced-options" className="border-t border-b-0 border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm bg-white/50 dark:bg-slate-800/50">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline px-6 py-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Settings className="h-5 w-5 text-purple-600" />
                      <span>Advanced Configuration</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pt-2 pb-6 space-y-6 bg-slate-50/70 dark:bg-slate-800/30">
                    
                    <div className="pt-4 space-y-6">
                        <h3 className="text-lg font-medium text-muted-foreground border-b pb-2">Story & Core Engine</h3>
                        <AdvancedBasicSettingsFields />
                    </div>
                    
                    <div className="pt-4 space-y-6">
                        <h3 className="text-lg font-medium text-muted-foreground border-b pb-2">Timing & Pace</h3>
                        <TimingFields />
                    </div>

                    <div className="pt-4 space-y-6">
                        <h3 className="text-lg font-medium text-muted-foreground border-b pb-2">Detailed Visuals</h3>
                        <AdvancedVisualsSettingsFields />
                    </div>
                    
                    <div className="pt-4 space-y-6">
                        <h3 className="text-lg font-medium text-muted-foreground border-b pb-2">Voice Language & Voice</h3>
                        <AdvancedAudioSettingsFields /> {/* VoiceSelectionField will be rendered inside this if accordion is open */}
                    </div>

                    <div className="pt-4 space-y-6">
                        <h3 className="text-lg font-medium text-muted-foreground border-b pb-2">Subtitles</h3>
                        <SubtitlesSection audioLanguage={audioLanguage} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button
                type="submit"
                disabled={isGenerating}
                size="lg"
                className="w-full text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {isGenerating ? 'Generating...' : `Generate Video (Est. ${creditCost} credits*)`}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                *Estimated cost. Actual credits will be charged based on final video length.
              </p>
            </form>
          </Form>
        </VideoGenerationFormProvider>

        <VideoGenerationConfirmDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleConfirmedSubmit}
          topic={formData?.topic || ''}
          creditCost={formData ? calculateCreditCost(formData) : 0}
          isCheckingCredits={isCheckingCredits}
          hasSufficientCredits={hasSufficientCredits}
        />
      </CardContent>
    </Card>
  );
};

export default SimplifiedVideoGenerationForm;
