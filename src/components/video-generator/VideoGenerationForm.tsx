
import { useState, useEffect } from 'react';
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
  VIDEO_CATEGORIES,
  SUBTITLE_FONTS,
  SUBTITLE_COLORS,
  TRANSITION_STYLES,
  ASPECT_RATIOS,
  IMAGE_MODELS,
  AUDIO_LANGUAGES,
  SUBTITLE_STYLES,
  IMAGE_STYLES,
  VOICE_OPTIONS
} from '@/lib/api';
import { VideoGenerationParams } from '@/lib/videoGenerationApi';
import { useAuth } from '@/hooks/use-auth';
import { VideoGenerationFormProvider } from './VideoGenerationFormContext';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const { user } = useAuth();
  const username = user?.email?.split('@')[0] || '';
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<VideoGenerationParams | null>(null);
  
  // Get first English voice as default
  const defaultVoice = Object.values(VOICE_OPTIONS)
    .find(voice => voice.language === 'English')?.id || Object.keys(VOICE_OPTIONS)[0];
  
  const form = useForm<VideoGenerationParams>({
    defaultValues: {
      // Username is automatically set from auth user
      script_model: 'chatgpt', // Set default script model
      topic: '',
      image_model: IMAGE_MODELS.advanced.value, // Updated to use advanced model as default since basic was removed
      image_ratio: '16:9',
      video_duration: 30, // Constrained to 20-50 range
      frame_fps: 4, // Constrained to 3-6 range
      subtitle_color: 'white',
      subtitle_font: 'Arial',
      video_category: 'Hollywood Script',
      transition_style: 'fade', // Updated to use 'fade' as default
      // New parameters with defaults
      image_style: [], 
      audio_language: 'English',
      voice: defaultVoice,
      subtitle_style: 'Default',
      subtitle_script: 'English'
    },
  });
  
  // Watch for audio_language changes to update subtitle_script options and font
  const audioLanguage = form.watch('audio_language');
  const subtitleScript = form.watch('subtitle_script');
  const subtitleFont = form.watch('subtitle_font');
  const topic = form.watch('topic');
  
  useEffect(() => {
    if (audioLanguage === 'Hindi' && form.getValues('subtitle_script') === 'English') {
      // Keep English as default even for Hindi audio
      // User can change it manually if needed
    } else if (audioLanguage === 'English') {
      // If audio language is English, make sure we're not using a Hindi-specific font
      const currentFont = form.getValues('subtitle_font');
      const fontData = SUBTITLE_FONTS[currentFont];
      
      // If current font is for Hindi language, reset it to default English font
      if (fontData && fontData.language === 'Hindi') {
        // Find the first English font
        const defaultEnglishFont = Object.entries(SUBTITLE_FONTS)
          .find(([_, data]) => data.language === 'English')?.[0] || 'Arial';
          
        form.setValue('subtitle_font', defaultEnglishFont);
      }
    }
    
    // Update voice selection based on language
    const currentVoice = form.getValues('voice');
    const currentVoiceObj = VOICE_OPTIONS[currentVoice];
    
    // If current voice doesn't match the selected language, update it
    if (currentVoiceObj && currentVoiceObj.language !== audioLanguage) {
      // Find first voice of the selected language
      const newVoice = Object.values(VOICE_OPTIONS)
        .find(voice => voice.language === audioLanguage);
      
      if (newVoice) {
        form.setValue('voice', newVoice.id);
      }
    }
  }, [audioLanguage, form]);
  
  const validateAndShowConfirmation = (data: VideoGenerationParams) => {
    // Validate topic is not empty
    if (!data.topic || data.topic.trim() === '') {
      toast.error('Please enter a topic for your video');
      return;
    }
    
    // Store form data for confirmation
    setFormData({
      ...data,
      username: username
    });
    
    // Show confirmation dialog
    setShowConfirmDialog(true);
  };
  
  const handleConfirmedSubmit = () => {
    if (formData) {
      onSubmit(formData);
      setShowConfirmDialog(false);
    }
  };
  
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
                <SubtitlesSection audioLanguage={audioLanguage} />
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
        
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Video Generation</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to generate a video with topic: <strong>{formData?.topic}</strong>
                <br /><br />
                This action will use one credit from your account. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmedSubmit}>
                Generate Video
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default VideoGenerationForm;
