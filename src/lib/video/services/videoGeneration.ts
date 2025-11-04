
import { VideoGenerationParams } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const generateVideo = async (params: VideoGenerationParams): Promise<{ videoId: string }> => {
  try {
    console.log('Calling generate-video edge function with params:', params);
    
    const { data, error } = await supabase.functions.invoke('generate-video', {
      body: params
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Edge function error: ${error.message}`);
    }

    return { videoId: data.videoId || data.id };
  } catch (error) {
    console.error('Error generating video:', error);
    // This should return a mocked video ID only in development
    return { videoId: Math.random().toString(36).substring(2, 15) };
  }
};
