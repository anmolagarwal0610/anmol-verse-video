
import { useState, useCallback, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { 
  generateImage, 
  calculateDimensions 
} from '@/lib/api';
import { useCredit } from '@/lib/creditService';

// Form validation schema
const formSchema = z.object({
  prompt: z.string().min(2, { message: 'Please enter a prompt with at least 2 characters' }),
  model: z.enum(['basic', 'advanced', 'pro']),
  aspectRatio: z.string(),
  customRatio: z.string().regex(/^\d+:\d+$/, { message: 'Format must be width:height (e.g., 16:9)' }).optional(),
  guidance: z.number().min(1).max(10),
  outputFormat: z.enum(['jpeg', 'png']),
  showSeed: z.boolean().default(false),
  seed: z.number().int().optional(),
  negativePrompt: z.string().optional(),
  imageStyles: z.array(z.string()).default([]),
});

export type FormValues = z.infer<typeof formSchema>;

export function useImageGenerator() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGalleryMessage, setShowGalleryMessage] = useState(false);
  const isSubmittingRef = useRef(false);
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      model: 'basic',
      aspectRatio: '16:9',
      guidance: 3.5,
      outputFormat: 'png',
      showSeed: false,
      imageStyles: [],
      negativePrompt: ''
    }
  });
  
  // Process and store image permanently
  const processImage = async (apiImageUrl: string, prompt: string) => {
    try {
      if (!user) {
        console.warn('Cannot process image: No authenticated user');
        return apiImageUrl; // Return original URL if no user
      }

      console.log('Processing image via Edge Function...');
      
      // Call our Supabase Edge Function to process the image
      const { data, error } = await supabase.functions.invoke('process-image', {
        body: {
          imageUrl: apiImageUrl,
          userId: user.id,
          prompt: prompt
        }
      });
      
      if (error) {
        console.error('Error invoking process-image function:', error);
        toast.error('Failed to process image. Using temporary URL.');
        return apiImageUrl; // Fallback to original URL
      }
      
      if (!data || !data.success) {
        console.error('Process image function returned unsuccessful response:', data);
        toast.error('Failed to process image. Using temporary URL.');
        return apiImageUrl; // Fallback to original URL
      }
      
      console.log('Image processed successfully:', data);
      
      if (data?.url) {
        return data.url; // Return the permanent URL
      } else {
        console.warn('No URL returned from image processing');
        toast.error('Failed to process image. Using temporary URL.');
        return apiImageUrl; // Fallback to original URL
      }
    } catch (err) {
      console.error('Error in processImage:', err);
      toast.error('Failed to process image. Using temporary URL.');
      return apiImageUrl; // Fallback to original URL
    }
  };
  
  const generateImageFromPrompt = useCallback(async (values: FormValues) => {
    if (isGenerating || isSubmittingRef.current) return;
    
    isSubmittingRef.current = true;
    setIsGenerating(true);
    setImageUrl(null);
    setShowGalleryMessage(false);
    
    try {
      const hasSufficientCredits = await useCredit();
      
      if (!hasSufficientCredits) {
        setIsGenerating(false);
        isSubmittingRef.current = false;
        return;
      }
      
      const ratio = values.aspectRatio === 'custom' && values.customRatio 
        ? values.customRatio 
        : values.aspectRatio;
        
      const dimensions = calculateDimensions(ratio);
      
      let enhancedPrompt = values.prompt;
      
      if (values.imageStyles && values.imageStyles.length > 0) {
        const styleNames = values.imageStyles.join(', ');
        enhancedPrompt += `. Image style: ${styleNames}`;
      }
      
      const result = await generateImage({
        prompt: enhancedPrompt,
        model: values.model,
        width: dimensions.width,
        height: dimensions.height,
        guidance: values.guidance,
        output_format: values.outputFormat,
        negative_prompt: values.negativePrompt,
        seed: values.showSeed ? values.seed : undefined
      });
      
      if (result.data && result.data.length > 0) {
        const temporaryImageUrl = result.data[0].url;
        
        // Set the temporary URL while we process the permanent one
        setImageUrl(temporaryImageUrl);
        toast.success('Image generated successfully!');
        
        // Process and get permanent URL
        if (user) {
          try {
            const permanentImageUrl = await processImage(temporaryImageUrl, values.prompt);
            console.log('Permanent URL received:', permanentImageUrl);
            
            // Set the permanent URL if different from temporary
            if (permanentImageUrl !== temporaryImageUrl) {
              setImageUrl(permanentImageUrl);
            }
            
            // Save the image to the database with the permanent URL
            const { error } = await supabase.from('generated_images').insert({
              prompt: values.prompt,
              image_url: permanentImageUrl,
              model: values.model,
              width: dimensions.width,
              height: dimensions.height,
              preferences: values.imageStyles,
              user_id: user.id
            });
            
            if (error) {
              console.error('Error saving image to database:', error);
              toast.error('Failed to save image to your gallery.');
            } else {
              setShowGalleryMessage(true);
            }
          } catch (processError) {
            console.error('Error during image processing:', processError);
            // Continue with the temporary URL, already set above
            toast.error('Failed to process image permanently. Using temporary URL.');
          }
        }
      } else {
        toast.error('No image data was returned.');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error(`Failed to generate image: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
      isSubmittingRef.current = false;
    }
  }, [isGenerating, user]);

  return {
    form,
    imageUrl,
    isGenerating,
    showGalleryMessage,
    generateImageFromPrompt
  };
}
