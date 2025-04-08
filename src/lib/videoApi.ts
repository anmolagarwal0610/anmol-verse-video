
import { VideoData } from '@/components/video-card/types';
import { API_CONFIG } from './apiUtils';
import { MOCK_VIDEOS } from './mockData';
import { supabase } from '@/integrations/supabase/client';

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
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('getVideos: Supabase error fetching videos:', error);
      throw error;
    }
    
    console.log('getVideos: Raw Supabase response:', supabaseVideos);
    
    if (supabaseVideos && supabaseVideos.length > 0) {
      console.log(`getVideos: Found ${supabaseVideos.length} videos in Supabase`);
      
      // Log each video's thumbnail URL for debugging
      console.log('getVideos: Video thumbnail URLs:');
      supabaseVideos.forEach((video, index) => {
        console.log(`Video #${index + 1} thumbnail:`, {
          id: video.id,
          url: video.thumbnail_url || 'null/undefined',
          fallbackNeeded: !video.thumbnail_url
        });
      });
      
      // Format the data to match VideoData structure
      const formattedVideos = supabaseVideos.map(video => {
        // Use a more reliable placeholder service
        const thumbnailUrl = 'https://placehold.co/640x1136/gray/white?text=Video';
        
        return {
          id: video.id,
          title: video.topic || 'Untitled Video',
          prompt: video.topic || '',
          url: video.video_url || '',
          thumbnail: video.thumbnail_url || thumbnailUrl,
          created_at: video.created_at || new Date().toISOString(),
          audioUrl: video.audio_url || undefined,
          transcriptUrl: video.transcript_url || undefined,
          imagesZipUrl: video.images_zip_url || undefined
        };
      });
      
      console.log('getVideos: Formatted videos:', formattedVideos);
      return formattedVideos;
    }
    
    console.log('getVideos: No videos found in Supabase, trying API fallback');
    
    // Fallback to API if no videos in Supabase
    try {
      console.log('getVideos: Attempting to fetch from API at:', `${API_CONFIG.BASE_URL}/videos`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/videos`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('getVideos: API response:', data);
      return data.videos || [];
    } catch (apiError) {
      console.error('getVideos: API fetch error:', apiError);
      throw new Error(`API not available: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('getVideos: Error fetching videos:', error);
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
      .single();
      
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
      // Use a more reliable placeholder service
      const thumbnailUrl = 'https://placehold.co/640x1136/gray/white?text=Video';
      
      return {
        id: video.id,
        title: video.topic,
        prompt: video.topic,
        url: video.video_url || '',
        thumbnail: video.thumbnail_url || thumbnailUrl,
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
