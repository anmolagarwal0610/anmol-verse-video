
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCredit } from '@/lib/creditService';
import { FormValues } from '@/lib/schemas/imageGeneratorSchema';
import { 
  ImageGenerationResult, 
  ImageGenerationOptions, 
  ImageMetadata 
} from './types';
import { 
  enhancePromptWithStyles, 
  generateImage, 
  getDimensionsFromRatio 
} from './generators';
import { processImage } from './processingService';

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
    const temporaryImageUrl = await generateImage(generationOptions);
    
    if (!temporaryImageUrl) {
      return null; // Failed to generate image
    }
    
    // Process and get permanent URL if user is logged in
    if (userId) {
      try {
        // Process image to get permanent URL
        const permanentImageUrl = await processImage(temporaryImageUrl, values.prompt, userId);
        
        // If processImage was successful and returned a different URL
        const isPermanentUrlDifferent = permanentImageUrl !== temporaryImageUrl;
        
        if (isPermanentUrlDifferent) {
          // Save image to database with permanent URL
          await saveImageToDatabase({
            prompt: values.prompt,
            model: values.model,
            width: dimensions.width,
            height: dimensions.height,
            preferences: values.imageStyles,
            userId: userId
          }, permanentImageUrl);
        } else {
          console.warn('Using temporary URL as permanent URL failed');
          toast.error('Could not save image permanently. Using temporary URL.');
        }
        
        return {
          temporaryImageUrl,
          permanentImageUrl,
          dimensions,
          success: true
        };
      } catch (processError: any) {
        console.error('Error during image processing:', processError);
        toast.error(`Failed to process image permanently: ${processError.message || 'Unknown error'}`);
        
        return {
          temporaryImageUrl,
          permanentImageUrl: temporaryImageUrl,
          dimensions,
          success: true
        };
      }
    } else {
      // User not logged in, just return the temporary URL
      console.log('User not logged in, using temporary URL only');
      return {
        temporaryImageUrl,
        permanentImageUrl: temporaryImageUrl,
        dimensions,
        success: true
      };
    }
  } catch (error: any) {
    console.error('Error generating image:', error);
    toast.error(`Failed to generate image: ${error.message || 'Unknown error'}`);
    return null;
  }
}

/**
 * Save generated image to the database
 */
async function saveImageToDatabase(metadata: ImageMetadata, imageUrl: string): Promise<void> {
  console.log('Saving generated image to database with permanent URL');
  
  const { error } = await supabase.from('generated_images').insert({
    prompt: metadata.prompt,
    image_url: imageUrl,
    model: metadata.model,
    width: metadata.width,
    height: metadata.height,
    preferences: metadata.preferences,
    user_id: metadata.userId
  });
  
  if (error) {
    console.error('Error saving image to database:', error);
    toast.error('Failed to save image to your gallery.');
  } else {
    console.log('Successfully saved image to database');
    toast.success('Image saved to your gallery!');
  }
}
