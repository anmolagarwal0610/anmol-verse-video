import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IMAGE_MODELS, VOICE_OPTIONS } from '@/lib/api';
import { VideoGenerationParams } from '@/lib/video/types';
import { VideoGenerationFormProvider } from '@/components/video-generator/VideoGenerationFormContext';
import VideoGenerationConfirmDialog from './dialogs/VideoGenerationConfirmDialog';
import { useVideoGenerationFormSubmit } from './hooks/useVideoGenerationFormSubmit';
import { PIXEL_OPTIONS } from '@/lib/constants/pixelOptions';
import { useEffect, useRef } from 'react';

// Import form section components
import BasicFormFields from './form-sections/BasicFormFields';
import VisualsSection from './form-sections/VisualsSection';
import AudioSection from './form-sections/audio';
import SubtitlesSection from './form-sections/SubtitlesSection';

interface VideoGenerationFormProps {
  onSubmit: (data: VideoGenerationParams) => void;
  isGenerating: boolean;
}

const VideoGenerationForm = ({
  onSubmit,
  isGenerating
}: VideoGenerationFormProps) => {
  // Get first English voice as default
  const defaultVoice = Object.values(VOICE_OPTIONS).find(voice => voice.language === 'English')?.id || Object.keys(VOICE_OPTIONS)[0];
  
  // Try to restore previous topic from sessionStorage if available
  let restoredTopic = '';
  try {
    restoredTopic = sessionStorage.getItem('lastVideoTopic') || '';
    if (restoredTopic) {
      console.log("[VIDEO FORM] Restored topic from sessionStorage:", restoredTopic);
    }
  } catch (e) {
    console.error("[VIDEO FORM] Failed to restore topic from sessionStorage:", e);
  }
  
  const form = useForm<VideoGenerationParams>({
    defaultValues: {
      script_model: 'chatgpt',
      topic: restoredTopic || '',
      image_model: IMAGE_MODELS.advanced.value,
      image_ratio: '16:9',
      image_pixel: PIXEL_OPTIONS['1080p'],
      pixelOption: '1080p',
      pixelOptionValue: undefined,
      video_duration: 25,
      frame_fps: 5,
      subtitle_color: 'white', // Will be cloud-white by default from text-foreground
      subtitle_font: 'Arial', // Consider Raleway if possible
      video_category: 'Hollywood Script',
      transition_style: 'fade',
      image_style: [],
      audio_language: 'English',
      voice: defaultVoice,
      subtitle_style: 'Default',
      subtitle_script: 'English'
    }
  });

  // Watch the values needed for credit calculation
  const audioLanguage = form.watch('audio_language');
  const selectedVoice = form.watch('voice');
  const videoDuration = form.watch('video_duration');
  const frameFPS = form.watch('frame_fps');
  const topicValue = form.watch('topic');
  
  // Log topic whenever it changes for debugging
  useEffect(() => {
    console.log("[VIDEO FORM] Current topic value:", topicValue);
  }, [topicValue]);
  
  const {
    showConfirmDialog,
    setShowConfirmDialog,
    validateAndShowConfirmation,
    handleConfirmedSubmit,
    formData,
    calculateCreditCost,
    isCheckingCredits,
    hasSufficientCredits
  } = useVideoGenerationFormSubmit({
    onSubmit
  });

  // Calculate credit cost for the current form values
  const creditCost = calculateCreditCost({
    ...form.getValues(),
    voice: selectedVoice,
    video_duration: videoDuration,
    frame_fps: frameFPS
  });

  return <Card className="w-full shadow-lg bg-darker-card-bg border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-cloud-white">Generate Video</CardTitle>
        <CardDescription className="text-light-gray-text">
          Create engaging videos in just a few minutes with our AI generator
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VideoGenerationFormProvider value={{
        form,
        isGenerating
      }}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(validateAndShowConfirmation)} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-cloud-white">Basic Settings</h3>
                <BasicFormFields />
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-cloud-white">Visual Settings</h3>
                <VisualsSection />
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-cloud-white">Audio Settings</h3>
                <AudioSection />
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-cloud-white">Subtitle Settings</h3>
                <SubtitlesSection audioLanguage={audioLanguage} />
              </div>
              
              {/* Button: Sky Blue Tint, hover to Light Cyan */}
              <Button type="submit" disabled={isGenerating} className="w-full bg-sky-blue-tint text-off-black hover:bg-light-cyan hover:text-off-black font-semibold">
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
    </Card>;
};
export default VideoGenerationForm;
