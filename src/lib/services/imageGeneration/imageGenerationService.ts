
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

/**
 * Function to use the appropriate number of credits based on model
 */
async function useModelCredits(userId: string, model: string): Promise<boolean> {
  try {
    const creditCost = MODEL_CREDIT_COSTS[model] || 1;
    
    // For pro model we need 5 credits
    if (model === 'pro') {
      // Custom procedure to use multiple credits at once
      // Use any type to bypass TypeScript's type checking for RPC functions
      const { data, error } = await (supabase.rpc as any)('use_multiple_credits', {
        user_id: userId,
        credit_amount: creditCost
      });
      
      if (error) {
        console.error('Error using credits:', error);
        toast.error(`Not enough credits. Pro model requires ${creditCost} credits.`);
        return false;
      }
      
      return data === true;
    } else {
      // Use the regular use_credit function for other models
      const { data, error } = await supabase.rpc('use_credit', {
        user_id: userId,
      });
      
      if (error) {
        console.error('Error using credit:', error);
        toast.error(error.message || 'Failed to use credit');
        return false;
      }
      
      return data === true;
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
      hasUserId: !!userId
    });
    
    // Early return if no user ID
    if (!userId) {
      toast.error('User ID is required to generate images');
      return null;
    }
    
    // Credit check based on model
    const hasSufficientCredits = await useModelCredits(userId, values.model);
    
    if (!hasSufficientCredits) {
      const creditCost = MODEL_CREDIT_COSTS[values.model] || 1;
      toast.error(`Insufficient credits to generate image. ${values.model.charAt(0).toUpperCase() + values.model.slice(1)} model requires ${creditCost} credit(s).`);
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
      imageStyles: values.imageStyles,
      referenceImageUrl: values.referenceImageUrl
    };
    
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
