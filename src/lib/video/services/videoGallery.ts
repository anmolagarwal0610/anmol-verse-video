
import { supabase } from '@/integrations/supabase/client';
import { VideoStatusResponse } from '../types';
import { toast } from 'sonner';

export const saveVideoToGallery = async (
  result: VideoStatusResponse, 
  userId: string
) => {
  try {
    const expiryTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const { error } = await supabase.from('generated_videos').insert({
      user_id: userId,
      topic: result.topic || 'Untitled Video',
      video_url: result.video_url,
      audio_url: result.audio_url,
      transcript_url: result.transcript_url,
      images_zip_url: result.images_zip_url,
      thumbnail_url: result.thumbnail_url,
      expiry_time: expiryTime
    });
    
    if (error) {
      console.error('Error saving video to database:', error);
      toast.error(`Failed to save video to gallery: ${error.message || 'Unknown error'}`);
    } else {
      toast.success('Video saved to your gallery! Note: Videos are automatically deleted after 7 days.');
    }
  } catch (dbError: any) {
    console.error('Error saving video to database:', dbError);
    toast.error(`Failed to save to gallery: ${dbError.message || 'Unknown error'}`);
  }
};
