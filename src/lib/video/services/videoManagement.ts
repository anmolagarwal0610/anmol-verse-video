
import { supabase } from '@/integrations/supabase/client';
import { VideoData } from '@/components/video-card';
import { MOCK_VIDEOS } from '@/lib/mockData';
import { API_CONFIG } from '@/lib/config/api';

export const getVideoById = async (id: string): Promise<VideoData | null> => {
  try {
    const { data: video, error } = await supabase
      .from('generated_videos')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error('Supabase error fetching video:', error);
      const response = await fetch(`${API_CONFIG.BASE_URL}/videos/${id}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    }
    
    if (video) {
      const embeddedSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjExMzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzRiNTU2MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlZpZGVvPC90ZXh0Pjwvc3ZnPg==';
      
      return {
        id: video.id,
        title: video.topic,
        prompt: video.topic,
        url: video.video_url || '',
        thumbnail: video.thumbnail_url || embeddedSVG,
        created_at: video.created_at,
        audioUrl: video.audio_url,
        transcriptUrl: video.transcript_url,
        imagesZipUrl: video.images_zip_url
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching video:', error);
    const video = MOCK_VIDEOS.find(v => v.id === id);
    return video || null;
  }
};

export const deleteVideo = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('generated_videos')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Supabase error deleting video:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/videos/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
};

