
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  IMAGE_MODELS,
  VOICE_OPTIONS,
} from '@/lib/api';
import { VideoGenerationParams } from '@/lib/videoGenerationApi';
import { VideoGenerationFormProvider } from './VideoGenerationFormContext';
import VideoGenerationConfirmDialog from './dialogs/VideoGenerationConfirmDialog';
import { useVideoGenerationFormSubmit } from './hooks/useVideoGenerationFormSubmit';

// Import form section components
import BasicFormFields from './form-sections/BasicFormFields';
import VisualsSection from './form-sections/VisualsSection';
import AudioSection from './form-sections/audio';
import SubtitlesSection from './form-sections/SubtitlesSection';

interface VideoGenerationFormProps {
  onSubmit: (data: VideoGenerationParams) => void;
  isGenerating: boolean;
}

const VideoGenerationForm = ({ onSubmit, isGenerating }: VideoGenerationFormProps) => {
  // Get first English voice as default
  const defaultVoice = Object.values(VOICE_OPTIONS)
    .find(voice => voice.language === 'English')?.id || Object.keys(VOICE_OPTIONS)[0];
  
  const form = useForm<VideoGenerationParams>({
    defaultValues: {
      script_model: 'chatgpt',
      topic: '',
      image_model: IMAGE_MODELS.advanced.value,
      image_ratio: '16:9',
      video_duration: 30,
      frame_fps: 4,
      subtitle_color: 'white',
      subtitle_font: 'Arial',
      video_category: 'Hollywood Script',
      transition_style: 'fade',
      image_style: [], 
      audio_language: 'English',
      voice: defaultVoice,
      subtitle_style: 'Default',
      subtitle_script: 'English'
    },
  });
  
  const { 
    showConfirmDialog,
    setShowConfirmDialog,
    validateAndShowConfirmation,
    handleConfirmedSubmit,
    formData
  } = useVideoGenerationFormSubmit({ onSubmit });
  
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Generate Video</CardTitle>
        <CardDescription>
          Create engaging videos in just a few minutes with our AI generator
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VideoGenerationFormProvider value={{ form, isGenerating }}>
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
                <SubtitlesSection />
              </div>
              
              <Button 
                type="submit" 
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                {isGenerating ? 'Generating...' : 'Generate Video'}
              </Button>
            </form>
          </Form>
        </VideoGenerationFormProvider>
        
        <VideoGenerationConfirmDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleConfirmedSubmit}
          topic={formData?.topic || ''}
        />
      </CardContent>
    </Card>
  );
};

export default VideoGenerationForm;
