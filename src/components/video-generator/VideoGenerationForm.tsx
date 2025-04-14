import { useState } from 'react';
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
  IMAGE_STYLES
} from '@/lib/api';
import { VideoGenerationParams } from '@/lib/videoGenerationApi';
import { useAuth } from '@/hooks/use-auth';
import { VideoGenerationFormProvider } from './VideoGenerationFormContext';

// Import form section components
import BasicFormFields from './form-sections/BasicFormFields';
import VisualsSection from './form-sections/VisualsSection';
import AudioSection from './form-sections/AudioSection';
import SubtitlesSection from './form-sections/SubtitlesSection';

interface VideoGenerationFormProps {
  onSubmit: (data: VideoGenerationParams) => void;
  isGenerating: boolean;
}

const VideoGenerationForm = ({ onSubmit, isGenerating }: VideoGenerationFormProps) => {
  const { user } = useAuth();
  const username = user?.email?.split('@')[0] || '';
  
  const form = useForm<VideoGenerationParams>({
    defaultValues: {
      // Username is automatically set from auth user
      topic: '',
      image_model: IMAGE_MODELS.basic.value, // Default to basic model
      image_ratio: '16:9',
      video_duration: 30,
      frame_fps: 5,
      subtitle_color: 'white',
      subtitle_font: 'Arial',
      video_category: 'Hollywood Script',
      transition_style: 'fade',
      // New parameters with defaults
      image_style: [],
      audio_language: 'English',
      voice: 'default',
      subtitle_style: 'Default',
      subtitle_script: 'English'
    },
  });
  
  // Watch for audio_language changes to update subtitle_script options
  const audioLanguage = form.watch('audio_language');
  
  // If audio language changes to Hindi, update the subtitle script options
  useState(() => {
    if (audioLanguage === 'Hindi' && form.getValues('subtitle_script') === 'English') {
      // Keep English as default even for Hindi audio
      // User can change it manually if needed
    }
  }, [audioLanguage]);
  
  const handleSubmit = (data: VideoGenerationParams) => {
    // Add username from auth before submitting
    const enrichedData = {
      ...data,
      username: username
    };
    
    onSubmit(enrichedData);
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
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
      </CardContent>
    </Card>
  );
};

export default VideoGenerationForm;
