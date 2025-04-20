import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VideoGenerationParams, VideoStatusResponse } from './video/types';
import { VideoData } from '@/components/video-card/types';
import { API_CONFIG } from './config/api';
import { MOCK_VIDEOS } from './mockData';

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
    // For development/fallback - in production you'd want to handle errors differently
    return { videoId: Math.random().toString(36).substring(2, 15) };
  }
};

export const saveVideoToGallery = async (
  result: VideoStatusResponse, 
  userId: string
) => {
  try {
    // Calculate expiry time (7 days from now)
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

export const getVideos = async (): Promise<VideoData[]> => {
  try {
    console.log('getVideos: Starting to fetch videos');
    
    // Get current user for debugging
    const { data: { user } } = await supabase.auth.getUser();
    console.log('getVideos: Current user:', user?.id);
    
    // If no authenticated user, return mock videos
    if (!user) {
      console.log('getVideos: No authenticated user, returning mock videos');
      return MOCK_VIDEOS;
    }
    
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
        // Use a data URL SVG placeholder that's guaranteed to work
        const embeddedSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjExMzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzRiNTU2MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlZpZGVvPC90ZXh0Pjwvc3ZnPg==';
        
        return {
          id: video.id,
          title: video.topic || 'Untitled Video',
          prompt: video.topic || '',
          url: video.video_url || '',
          thumbnail: video.thumbnail_url || embeddedSVG,
          created_at: video.created_at || new Date().toISOString(),
          audioUrl: video.audio_url || undefined,
          transcriptUrl: video.transcript_url || undefined,
          imagesZipUrl: video.images_zip_url || undefined
        };
      });
      
      console.log('getVideos: Formatted videos:', formattedVideos);
      return formattedVideos;
    }
    
    // For authenticated users, return empty array if no videos found
    console.log('getVideos: No videos found for authenticated user, returning empty array');
    return [];
  } catch (error) {
    console.error('getVideos: Error fetching videos:', error);
    // For authenticated users, return empty array on error
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('getVideos: Error occurred for authenticated user, returning empty array');
      return [];
    }
    // Only use mock videos as fallback for non-authenticated users
    console.warn('getVideos: Using MOCK_VIDEOS as fallback for non-authenticated user');
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
      // Use a data URL SVG placeholder that's guaranteed to work
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
