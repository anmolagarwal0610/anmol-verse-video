
import { VideoData } from '@/components/video-card/types';
import { API_CONFIG } from './apiUtils';
import { MOCK_VIDEOS } from './mockData';
import { supabase } from '@/integrations/supabase/client';
import { GeneratedVideoRow } from '@/types/supabase';

export const generateVideo = async (prompt: string): Promise<{ videoId: string }> => {
  try {
    // Real API implementation
    const response = await fetch(`${API_CONFIG.BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return { videoId: data.videoId || data.id };
  } catch (error) {
    console.error('Error generating video:', error);
    // For development/fallback - in production you'd want to handle errors differently
    return { videoId: Math.random().toString(36).substring(2, 15) };
  }
};

export const getVideos = async (): Promise<VideoData[]> => {
  try {
    console.log('getVideos: Starting to fetch videos');
    
    // Get current user for debugging
    const { data: { user } } = await supabase.auth.getUser();
    console.log('getVideos: Current user:', user?.id);
    
    // First try to fetch from Supabase
    console.log('getVideos: Querying Supabase...');
    const { data: supabaseVideos, error } = await supabase
      .from('generated_videos')
      .select('*')
      .order('created_at', { ascending: false }) as { data: GeneratedVideoRow[] | null, error: any };
    
    if (error) {
      console.error('getVideos: Supabase error fetching videos:', error);
      throw error;
    }
    
    console.log('getVideos: Raw Supabase response:', supabaseVideos);
    
    if (supabaseVideos && supabaseVideos.length > 0) {
      console.log(`getVideos: Found ${supabaseVideos.length} videos in Supabase`);
      
      // Format the data to match VideoData structure
      const formattedVideos = supabaseVideos.map(video => ({
        id: video.id,
        title: video.topic,
        prompt: video.topic,
        url: video.video_url || '',
        thumbnail: video.thumbnail_url || 'https://via.placeholder.com/640x1136',
        created_at: video.created_at,
        audioUrl: video.audio_url,
        transcriptUrl: video.transcript_url,
        imagesZipUrl: video.images_zip_url
      }));
      
      console.log('getVideos: Formatted videos:', formattedVideos);
      return formattedVideos;
    }
    
    console.log('getVideos: No videos found in Supabase, trying API fallback');
    
    // Fallback to API if no videos in Supabase
    const response = await fetch(`${API_CONFIG.BASE_URL}/videos`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('getVideos: API response:', data);
    return data.videos || [];
  } catch (error) {
    console.error('getVideos: Error fetching videos:', error);
    // Fallback to mock data during development
    console.warn('getVideos: Using MOCK_VIDEOS as fallback');
    return MOCK_VIDEOS;
  }
};

export const getVideoById = async (id: string): Promise<VideoData | null> => {
  try {
    // Try Supabase first
    const { data: video, error } = await supabase
      .from('generated_videos')
      .select('*')
      .eq('id', id)
      .single() as { data: GeneratedVideoRow | null, error: any };
      
    if (error) {
      console.error('Supabase error fetching video:', error);
      // If not found in Supabase or other error, try API
      const response = await fetch(`${API_CONFIG.BASE_URL}/videos/${id}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    }
    
    if (video) {
      return {
        id: video.id,
        title: video.topic,
        prompt: video.topic,
        url: video.video_url || '',
        thumbnail: video.thumbnail_url || 'https://via.placeholder.com/640x1136',
        created_at: video.created_at,
        audioUrl: video.audio_url,
        transcriptUrl: video.transcript_url,
        imagesZipUrl: video.images_zip_url
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching video:', error);
    // Fallback to mock data during development
    const video = MOCK_VIDEOS.find(v => v.id === id);
    return video || null;
  }
};

export const deleteVideo = async (id: string): Promise<boolean> => {
  try {
    // Try to delete from Supabase first
    const { error } = await supabase
      .from('generated_videos')
      .delete()
      .eq('id', id) as { error: any };
      
    if (error) {
      console.error('Supabase error deleting video:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    
    // Fallback to API
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
