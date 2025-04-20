
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VideoGenerationParams, VideoStatusResponse } from '../types';
import { API_CONFIG } from '@/lib/config/api';

export const generateVideo = async (params: VideoGenerationParams): Promise<{ videoId: string }> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return { videoId: data.videoId || data.id };
  } catch (error) {
    console.error('Error generating video:', error);
    return { videoId: Math.random().toString(36).substring(2, 15) };
  }
};

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

