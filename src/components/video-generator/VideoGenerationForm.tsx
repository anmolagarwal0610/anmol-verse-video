
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
  IMAGE_MODELS
} from '@/lib/api';
import { VideoGenerationParams } from '@/lib/videoGenerationApi';
import { useAuth } from '@/hooks/use-auth';
import { VideoGenerationFormProvider } from './VideoGenerationFormContext';

// Import form section components
import BasicFormFields from './form-sections/BasicFormFields';
import DurationAndFpsFields from './form-sections/DurationAndFpsFields';
import RatioAndTransitionFields from './form-sections/RatioAndTransitionFields';
import SubtitleStyleFields from './form-sections/SubtitleStyleFields';

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
      transition_style: 'fade'
    },
  });
  
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
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <BasicFormFields />
              <DurationAndFpsFields />
              <RatioAndTransitionFields />
              <SubtitleStyleFields />
              
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
