
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCredit } from '@/lib/creditService';
import { FormValues } from '@/lib/schemas/imageGeneratorSchema';
import { 
  ImageGenerationResult, 
  ImageGenerationOptions
} from './types';
import { 
  enhancePromptWithStyles, 
  generateImage, 
  getDimensionsFromRatio 
} from './generators';

/**
 * Main entry point for generating images
 */
export async function generateImageFromPrompt(
  values: FormValues, 
  userId?: string
): Promise<ImageGenerationResult | null> {
  try {
    console.log('Starting image generation process with values:', {
      model: values.model,
      aspectRatio: values.aspectRatio,
      customRatio: values.customRatio,
      hasUserId: !!userId
    });
    
    // Credit check
    const hasSufficientCredits = await useCredit();
    
    if (!hasSufficientCredits) {
      toast.error('Insufficient credits to generate image');
      return null;
    }
    
    // Calculate dimensions from aspect ratio
    const dimensions = getDimensionsFromRatio(values.aspectRatio, values.customRatio);
    
    // Enhance prompt with style preferences if provided
    const enhancedPrompt = enhancePromptWithStyles(values.prompt, values.imageStyles);
    
    // Generate options object
    const generationOptions: ImageGenerationOptions = {
      prompt: enhancedPrompt,
      model: values.model,
      width: dimensions.width,
      height: dimensions.height,
      guidance: values.guidance,
      outputFormat: values.outputFormat,
      negativePrompt: values.negativePrompt,
      seed: values.showSeed ? values.seed : undefined,
      imageStyles: values.imageStyles
    };
    
    // Generate image
    const generatedImageUrl = await generateImage(generationOptions);
    
    if (!generatedImageUrl) {
      return null; // Failed to generate image
    }
    
    // Save to database if user is logged in
    if (userId) {
      try {
        const { error } = await supabase.from('generated_images').insert({
          prompt: values.prompt,
          image_url: generatedImageUrl,
          user_id: userId,
          width: dimensions.width,
          height: dimensions.height,
          model: values.model,
          preferences: values.imageStyles
        });
        
        if (error) {
          console.error('Error saving image to database:', error);
          toast.error(`Failed to save image to gallery: ${error.message || 'Unknown error'}`);
        } else {
          toast.success('Image saved to your gallery!');
        }
      } catch (dbError: any) {
        console.error('Error saving image to database:', dbError);
        toast.error(`Failed to save to gallery: ${dbError.message || 'Unknown error'}`);
      }
    }
    
    // Return the generated image URL
    return {
      temporaryImageUrl: generatedImageUrl,
      permanentImageUrl: generatedImageUrl, // Same URL, no processing needed
      dimensions,
      success: true
    };
  } catch (error: any) {
    console.error('Error generating image:', error);
    toast.error(`Failed to generate image: ${error.message || 'Unknown error'}`);
    return null;
  }
}

// Export the type
export type { ImageGenerationResult } from './types';
