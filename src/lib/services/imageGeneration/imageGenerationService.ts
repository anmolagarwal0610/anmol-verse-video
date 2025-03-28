
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
import { saveImageToDatabase } from '../imageProcessingService';

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
    
    // Save to database if user is logged in - using direct API URL 
    if (userId) {
      try {
        // Save the API URL directly to the database
        await saveImageToDatabase(
          generatedImageUrl,
          values.prompt,
          userId,
          {
            width: dimensions.width,
            height: dimensions.height,
            model: values.model,
            preferences: values.imageStyles
          }
        );
        
        // Show gallery message if user is logged in
        return {
          temporaryImageUrl: generatedImageUrl,
          permanentImageUrl: generatedImageUrl, // Same URL, no processing
          dimensions,
          success: true
        };
      } catch (dbError: any) {
        console.error('Error saving image to database:', dbError);
        toast.error(`Failed to save image to gallery: ${dbError.message || 'Unknown error'}`);
      }
    }
    
    // Return the generated image URL
    return {
      temporaryImageUrl: generatedImageUrl,
      permanentImageUrl: generatedImageUrl, // Same URL, no processing
      dimensions,
      success: true
    };
  } catch (error: any) {
    console.error('Error generating image:', error);
    toast.error(`Failed to generate image: ${error.message || 'Unknown error'}`);
    return null;
  }
}
