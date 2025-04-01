
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  ASPECT_RATIOS,
  VIDEO_CATEGORIES,
  TRANSITION_STYLES,
  SUBTITLE_FONTS,
  SUBTITLE_COLORS
} from '@/lib/api';
import { VideoGenerationParams } from '@/lib/videoGenerationApi';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/hooks/use-auth';
import { InfoCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface VideoGenerationFormProps {
  onSubmit: (data: VideoGenerationParams) => void;
  isGenerating: boolean;
}

const VideoGenerationForm = ({ onSubmit, isGenerating }: VideoGenerationFormProps) => {
  const { user } = useAuth();
  const username = user?.email?.split('@')[0] || '';
  
  const form = useForm<VideoGenerationParams>({
    defaultValues: {
      username: username,
      topic: '',
      image_model: 'black-forest-labs/FLUX.1-schnell-free',
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
    onSubmit(data);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Your username" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be used to attribute the video.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Video Category */}
              <FormField
                control={form.control}
                name="video_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Category</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isGenerating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(VIDEO_CATEGORIES).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Topic field */}
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your video topic or script idea" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Describe what you want your video to be about. Be specific for better results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video Duration */}
              <FormField
                control={form.control}
                name="video_duration"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Video Duration (seconds)</FormLabel>
                      <span className="text-sm font-medium">{value}s</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={10}
                        max={120}
                        step={5}
                        value={[value]}
                        onValueChange={([newValue]) => onChange(newValue)}
                        disabled={isGenerating}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose the length of your video
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Frame FPS */}
              <FormField
                control={form.control}
                name="frame_fps"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>
                        Frame Rate (FPS)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircle className="h-4 w-4 ml-2 inline-block text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Higher frame rates create smoother videos but take longer to generate</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <span className="text-sm font-medium">{value} fps</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[value]}
                        onValueChange={([newValue]) => onChange(newValue)}
                        disabled={isGenerating}
                      />
                    </FormControl>
                    <FormDescription>
                      Frames per second (FPS) affects video smoothness
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Ratio */}
              <FormField
                control={form.control}
                name="image_ratio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Ratio</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isGenerating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ratio" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(ASPECT_RATIOS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Aspect ratio for your video
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Transition Style */}
              <FormField
                control={form.control}
                name="transition_style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transition Style</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isGenerating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select transition" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(TRANSITION_STYLES).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      How frames transition in your video
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subtitle Font */}
              <FormField
                control={form.control}
                name="subtitle_font"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle Font</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isGenerating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(SUBTITLE_FONTS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Subtitle Color */}
              <FormField
                control={form.control}
                name="subtitle_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle Color</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isGenerating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(SUBTITLE_COLORS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
      </CardContent>
    </Card>
  );
};

export default VideoGenerationForm;
