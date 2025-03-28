
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Process an image by sending it to our Supabase Edge Function,
 * which will download and store it permanently in Supabase Storage
 */
export async function processImage(apiImageUrl: string, prompt: string, userId: string): Promise<string> {
  try {
    console.log('Starting image processing workflow...');
    console.log('Params:', {
      imageUrlLength: apiImageUrl?.length || 0,
      userId,
      promptLength: prompt?.length || 0
    });
    
    // First verify the image URL is valid
    if (!apiImageUrl || !apiImageUrl.startsWith('http')) {
      console.error('Invalid image URL provided:', apiImageUrl?.substring(0, 30) + '...');
      toast.error('Invalid image URL. Cannot process image.');
      return apiImageUrl; // Return original URL
    }
    
    // Verify user ID is provided
    if (!userId) {
      console.error('No user ID provided for image processing');
      toast.error('Authentication required for image processing.');
      return apiImageUrl; // Return original URL
    }
    
    // Call our Edge Function with proper error handling
    try {
      console.log('Invoking process-image Edge Function...');
      
      // Construct the request body as a stringified JSON object
      const requestBody = JSON.stringify({
        imageUrl: apiImageUrl,
        userId: userId,
        prompt: prompt || 'Generated image'
      });
      
      console.log('Request payload:', {
        type: typeof requestBody,
        length: requestBody.length,
        preview: requestBody.substring(0, 100) + '...'
      });
      
      // Make the request to the Edge Function with explicit content-type header
      const { data, error } = await supabase.functions.invoke('process-image', {
        body: requestBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Log the full response for debugging
      console.log('Edge function response:', {
        data: data,
        error: error ? { message: error.message, name: error.name } : null
      });
      
      // Handle error responses
      if (error) {
        console.error('Error from Edge Function:', error);
        toast.error(`Processing failed: ${error.message || 'Unknown error'}`);
        return apiImageUrl; // Fallback to original URL
      }
      
      // Verify we got a valid response
      if (!data) {
        console.error('No data returned from Edge Function');
        toast.error('No response from image processor');
        return apiImageUrl; // Fallback to original URL
      }
      
      // Check for success flag
      if (!data.success) {
        console.error('Processing returned unsuccessful:', data);
        const errorMessage = data.error || 'Unknown processing error';
        toast.error(errorMessage);
        return apiImageUrl; // Fallback to original URL
      }
      
      // Verify we got a URL back
      if (!data.url) {
        console.warn('No URL returned from processing');
        toast.error('Failed to get permanent image URL');
        return apiImageUrl; // Fallback to original URL
      }
      
      console.log('Successfully processed image, permanent URL:', data.url.substring(0, 50) + '...');
      toast.success('Image processed and saved to your gallery!');
      return data.url;
    } catch (invokeError: any) {
      console.error('Exception during Edge Function invocation:', invokeError);
      toast.error(`Failed to send a request to the Edge Function: ${invokeError.message || 'Unknown error'}`);
      return apiImageUrl; // Fallback to original URL
    }
  } catch (err: any) {
    console.error('Top-level error in processImage:', err);
    toast.error('Failed to process image. Using temporary URL.');
    return apiImageUrl; // Fallback to original URL
  }
}
