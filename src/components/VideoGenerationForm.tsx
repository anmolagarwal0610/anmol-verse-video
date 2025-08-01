import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IMAGE_MODELS, VOICE_OPTIONS } from '@/lib/api';
import { VideoGenerationParams } from '@/lib/video/types';
import { VideoGenerationFormProvider } from '@/components/video-generator/VideoGenerationFormContext';
import VideoGenerationConfirmDialog from './video-generator/dialogs/VideoGenerationConfirmDialog';
import { useVideoGenerationFormSubmit } from './video-generator/hooks/useVideoGenerationFormSubmit';
import { PIXEL_OPTIONS } from '@/lib/constants/pixelOptions';

// Import form section components
import BasicFormFields from './video-generator/form-sections/BasicFormFields';
import VisualsSection from './video-generator/form-sections/VisualsSection';
import AudioSection from './video-generator/form-sections/audio';
import SubtitlesSection from './video-generator/form-sections/SubtitlesSection';

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
  
  const form = useForm<VideoGenerationParams>({
    defaultValues: {
      script_model: 'chatgpt',
      topic: '',
      image_model: IMAGE_MODELS.advanced.value,
      image_ratio: '16:9',
      image_pixel: PIXEL_OPTIONS['1080p'],
      pixelOption: '1080p',
      pixelOptionValue: undefined,
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
      subtitle_script: 'English'
    }
  });

  // Watch the values needed for credit calculation
  const audioLanguage = form.watch('audio_language');
  const selectedVoice = form.watch('voice');
  const videoDuration = form.watch('video_duration');
  const frameFPS = form.watch('frame_fps');
  
  const {
    showConfirmDialog,
    setShowConfirmDialog,
    validateAndShowConfirmation,
    handleConfirmedSubmit,
    formData,
    calculateCreditCost,
    isCheckingCredits
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

  return <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Generate Video</CardTitle>
        <CardDescription>
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
                <h3 className="text-lg font-semibold">Basic Settings</h3>
                <BasicFormFields />
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Visual Settings</h3>
                <VisualsSection />
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Audio Settings</h3>
                <AudioSection />
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Subtitle Settings</h3>
                <SubtitlesSection audioLanguage={audioLanguage} />
              </div>
              
              <Button 
                type="submit" 
                disabled={isGenerating} 
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:brightness-105 shadow-md hover:shadow-lg transition-all"
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
        />
      </CardContent>
    </Card>;
};
export default VideoGenerationForm;
