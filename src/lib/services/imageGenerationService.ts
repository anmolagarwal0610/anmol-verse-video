
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { generateImage, calculateDimensions } from '@/lib/api';
import { useCredit } from '@/lib/creditService';
import { FormValues } from '@/lib/schemas/imageGeneratorSchema';
import { processImage } from '@/lib/services/imageProcessingService';

export interface ImageGenerationResult {
  temporaryImageUrl: string;
  permanentImageUrl: string;
  dimensions: {
    width: number;
    height: number;
  };
  success: boolean;
}

export async function generateImageFromPrompt(
  values: FormValues, 
  userId?: string
): Promise<ImageGenerationResult | null> {
  try {
    console.log('Starting image generation process with values:', {
      ...values,
      userId: userId || 'not provided'
    });
    
    const hasSufficientCredits = await useCredit();
    
    if (!hasSufficientCredits) {
      toast.error('Insufficient credits to generate image');
      return null;
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
    
    console.log('Sending image generation request to API with dimensions:', dimensions);
    
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
      toast.success('Image generated successfully!');
      console.log('Got temporary image URL from API');
      
      // Process and get permanent URL if user is logged in
      if (userId) {
        console.log('User is logged in, processing image for permanent storage');
        try {
          console.log('Calling processImage with userId:', userId);
          const permanentImageUrl = await processImage(temporaryImageUrl, values.prompt, userId);
          console.log('Permanent URL received:', permanentImageUrl.substring(0, 30) + '...');
          
          // Check if we actually got a different URL back
          const isPermanentUrlDifferent = permanentImageUrl !== temporaryImageUrl;
          console.log('Did we get a different permanent URL?', isPermanentUrlDifferent);
          
          if (isPermanentUrlDifferent) {
            // Save the image to the database with the permanent URL
            console.log('Saving generated image to database with permanent URL');
            const { error } = await supabase.from('generated_images').insert({
              prompt: values.prompt,
              image_url: permanentImageUrl,
              model: values.model,
              width: dimensions.width,
              height: dimensions.height,
              preferences: values.imageStyles,
              user_id: userId
            });
            
            if (error) {
              console.error('Error saving image to database:', error);
              toast.error('Failed to save image to your gallery.');
            } else {
              console.log('Successfully saved image to database');
            }
          } else {
            console.warn('Permanent URL is same as temporary, not saving to database');
          }
          
          return {
            temporaryImageUrl,
            permanentImageUrl,
            dimensions,
            success: true
          };
        } catch (processError) {
          console.error('Error during image processing:', processError);
          toast.error('Failed to process image permanently. Using temporary URL.');
          
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
    } else {
      console.error('No image data returned from API');
      toast.error('No image data was returned.');
      return null;
    }
  } catch (error: any) {
    console.error('Error generating image:', error);
    toast.error(`Failed to generate image: ${error.message || 'Unknown error'}`);
    return null;
  }
}
