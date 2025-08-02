
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { FormValues } from '@/lib/schemas/imageGeneratorSchema';
import { 
  ImageGenerationResult, 
  ImageGenerationOptions,
  MODEL_CREDIT_COSTS
} from './types';
import { 
  enhancePromptWithStyles, 
  generateImage, 
  getDimensionsFromRatio 
} from './generators';
import { calculateCreditCost } from '@/lib/constants/pixelOptions';
import { checkCredits, useCredit } from '@/lib/creditService';

/**
 * Function to use the appropriate number of credits based on model and dimensions
 */
async function useModelCredits(userId: string, model: string, width: number, height: number, retryCount = 0): Promise<boolean> {
  try {
    if (model === 'basic') return true; // Basic model is free
    
    const creditCost = calculateCreditCost(width, height, model);
    console.log(`Using ${creditCost} credits for model ${model} with dimensions ${width}x${height}`);
    
    // Verify available credits before attempting to use them
    const availableCredits = await checkCredits(true);
    console.log(`User has ${availableCredits} credits available, needs ${creditCost}`);
    
    if (availableCredits < creditCost) {
      toast.error(`Not enough credits. This image requires ${creditCost} credits. You have ${availableCredits}.`);
      return false;
    }
    
    // Use multiple credits
    if (creditCost > 0) {
      const success = await useCredit(creditCost);
      
      if (!success && retryCount < 1) {
        console.log('Credit deduction failed, retrying once...');
        // Short delay before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        return useModelCredits(userId, model, width, height, retryCount + 1);
      }
      
      return success;
    } else {
      return true; // No credits needed (basic model)
    }
  } catch (error: any) {
    console.error('Unexpected error using credits:', error);
    toast.error(error.message || 'An unexpected error occurred');
    return false;
  }
}

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
      pixelOption: values.pixelOption,
      pixelOptionValue: values.pixelOptionValue,
      hasUserId: !!userId,
      hasReferenceImageUrl: !!values.referenceImageUrl,
      hasConditionImage: !!values.conditionImage
    });
    
    // Early return if no user ID
    if (!userId) {
      toast.error('User ID is required to generate images');
      return null;
    }
    
    // Calculate dimensions from aspect ratio and pixel option
    const dimensions = getDimensionsFromRatio(
      values.aspectRatio, 
      values.pixelOption, 
      values.pixelOptionValue,
      values.customRatio
    );
    
    console.log('Calculated dimensions:', dimensions);
    
    // Credit check based on model and dimensions
    console.log('Performing credit check and deduction...');
    const hasSufficientCredits = await useModelCredits(
      userId, 
      values.model, 
      dimensions.width, 
      dimensions.height
    );
    
    if (!hasSufficientCredits) {
      const creditCost = calculateCreditCost(dimensions.width, dimensions.height, values.model);
      console.error(`Credit check/deduction failed for cost: ${creditCost}`);
      // Toast error is already shown in useModelCredits
      return null;
    }
    
    console.log('Credit check/deduction successful, proceeding with image generation');
    
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
      imageStyles: values.imageStyles,
      referenceImageUrl: values.referenceImageUrl,
      conditionImage: values.conditionImage // Add this field
    };
    
    console.log('Generation options:', {
      ...generationOptions,
      prompt: generationOptions.prompt.substring(0, 50) + '...',
      hasReferenceImageUrl: !!generationOptions.referenceImageUrl,
      hasConditionImage: !!generationOptions.conditionImage
    });
    
    // Generate image
    const generatedImageUrl = await generateImage(generationOptions);
    
    if (!generatedImageUrl) {
      return null;
    }
    
    // Save to database
    try {
      // Calculate expiry time (24 hours from now)
      const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      const { error } = await supabase.from('generated_images').insert({
        prompt: values.prompt,
        image_url: generatedImageUrl,
        user_id: userId,
        width: dimensions.width,
        height: dimensions.height,
        model: values.model,
        preferences: values.imageStyles,
        expiry_time: expiryTime
      });
      
      if (error) {
        console.error('Error saving image to database:', error);
        toast.error(`Failed to save image to gallery: ${error.message || 'Unknown error'}`);
      } else {
        toast.success('Image saved to your gallery! Note: Images are automatically deleted after 24 hours.');
      }
    } catch (dbError: any) {
      console.error('Error saving image to database:', dbError);
      toast.error(`Failed to save to gallery: ${dbError.message || 'Unknown error'}`);
    }
    
    // Return the generated image URL
    return {
      temporaryImageUrl: generatedImageUrl,
      permanentImageUrl: generatedImageUrl,
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
