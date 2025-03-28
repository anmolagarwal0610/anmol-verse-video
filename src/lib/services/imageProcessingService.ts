
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function processImage(apiImageUrl: string, prompt: string, userId: string): Promise<string> {
  try {
    console.log('Processing image via Edge Function...');
    console.log('Params:', {
      imageUrl: apiImageUrl?.substring(0, 30) + '...',
      userId,
      promptLength: prompt?.length || 0
    });
    
    // Call our Supabase Edge Function with explicit error handling
    try {
      console.log('Invoking process-image function...');
      const { data, error } = await supabase.functions.invoke('process-image', {
        body: {
          imageUrl: apiImageUrl,
          userId: userId,
          prompt: prompt
        }
      });
      
      console.log('Edge function response:', data, error);
      
      if (error) {
        console.error('Error invoking process-image function:', error);
        toast.error(`Failed to process image: ${error.message || 'Unknown error'}`);
        return apiImageUrl; // Fallback to original URL
      }
      
      if (!data || !data.success) {
        console.error('Process image function returned unsuccessful response:', data);
        const errorMessage = data?.error || 'Failed to process image';
        toast.error(errorMessage);
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
    } catch (invokeError) {
      console.error('Exception during function invocation:', invokeError);
      toast.error(`Failed to invoke process-image function: ${invokeError.message || 'Unknown error'}`);
      return apiImageUrl; // Fallback to original URL
    }
  } catch (err) {
    console.error('Error in processImage:', err);
    toast.error('Failed to process image. Using temporary URL.');
    return apiImageUrl; // Fallback to original URL
  }
}
