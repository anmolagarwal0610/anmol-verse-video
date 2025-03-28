
import { toast } from 'sonner';
import { generateImage as apiGenerateImage, calculateDimensions } from '@/lib/imageApi';
import { ImageGenerationOptions } from './types';

/**
 * Enhances a prompt with selected image styles
 */
export function enhancePromptWithStyles(prompt: string, imageStyles?: string[]): string {
  if (!imageStyles || imageStyles.length === 0) {
    return prompt;
  }
  
  const styleNames = imageStyles.join(', ');
  return `${prompt}. Image style: ${styleNames}`;
}

/**
 * Generates an image using the external API
 */
export async function generateImage(options: ImageGenerationOptions): Promise<string | null> {
  try {
    console.log('Sending image generation request to API with dimensions:', {
      width: options.width,
      height: options.height
    });
    
    const result = await apiGenerateImage({
      prompt: options.prompt,
      model: options.model,
      width: options.width,
      height: options.height,
      guidance: options.guidance,
      output_format: options.outputFormat,
      negative_prompt: options.negativePrompt,
      seed: options.seed
    });
    
    if (!result.data || result.data.length === 0) {
      console.error('No image data returned from API');
      toast.error('No image data was returned from the generation API');
      return null;
    }
    
    // Return the temporary image URL from the API
    const temporaryImageUrl = result.data[0].url;
    console.log('Received temporary image URL from API:', temporaryImageUrl.substring(0, 30) + '...');
    toast.success('Image generated successfully!');
    
    return temporaryImageUrl;
  } catch (error: any) {
    console.error('Error generating image through API:', error);
    toast.error(`Failed to generate image: ${error.message || 'Unknown error'}`);
    return null;
  }
}

/**
 * Calculate dimensions based on aspect ratio
 */
export function getDimensionsFromRatio(aspectRatio: string, customRatio?: string): {width: number, height: number} {
  const ratio = aspectRatio === 'custom' && customRatio ? customRatio : aspectRatio;
  return calculateDimensions(ratio);
}
