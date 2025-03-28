
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Simple function to log image URL to database
 * No processing or storage, just saves the API URL directly
 */
export async function saveImageToDatabase(
  apiImageUrl: string, 
  prompt: string, 
  userId: string, 
  metadata: {
    width: number,
    height: number,
    model: string,
    preferences?: string[]
  }
): Promise<string> {
  try {
    console.log('Saving image URL to database:', {
      urlLength: apiImageUrl?.length || 0,
      prompt: prompt?.substring(0, 30) + '...',
      userId
    });
    
    // Verify the image URL is valid
    if (!apiImageUrl || !apiImageUrl.startsWith('http')) {
      console.error('Invalid image URL provided:', apiImageUrl?.substring(0, 30) + '...');
      toast.error('Invalid image URL. Cannot save to gallery.');
      return apiImageUrl;
    }
    
    // Verify user ID is provided
    if (!userId) {
      console.error('No user ID provided for image database entry');
      toast.error('Authentication required for saving to gallery.');
      return apiImageUrl;
    }
    
    // Insert the image URL directly into the database
    const { error } = await supabase.from('generated_images').insert({
      prompt: prompt,
      image_url: apiImageUrl,
      user_id: userId,
      width: metadata.width,
      height: metadata.height,
      model: metadata.model,
      preferences: metadata.preferences
    });
    
    if (error) {
      console.error('Error saving image to database:', error);
      toast.error('Failed to save image to gallery.');
      return apiImageUrl;
    }
    
    console.log('Successfully saved image URL to database');
    toast.success('Image saved to your gallery!');
    return apiImageUrl;
  } catch (err: any) {
    console.error('Error in saveImageToDatabase:', err);
    toast.error('Failed to save image to gallery.');
    return apiImageUrl;
  }
}
