
import { supabase } from '@/integrations/supabase/client';
import { VideoStatusResponse } from '../types';
import { toast } from 'sonner';
import { VideoData } from '@/components/video-card';

// Track saved video IDs to prevent duplicate saves
const savedVideoIds = new Set<string>();

export const saveVideoToGallery = async (
  result: VideoStatusResponse, 
  userId: string
) => {
  try {
    console.log('🔎 [saveVideoToGallery] Starting save operation with userId:', userId);
    console.log('🔎 [saveVideoToGallery] Result topic:', result.topic);
    console.log('🔎 [saveVideoToGallery] Result video_url:', result.video_url);
    
    // Skip if no video URL (indicates incomplete generation)
    if (!result.video_url) {
      console.warn('🔎 [saveVideoToGallery] No video URL provided, skipping save');
      return false;
    }
    
    // Create a unique ID based on video URL to deduplicate
    const videoIdentifier = result.video_url;
    
    // Check if we've already saved this video
    if (savedVideoIds.has(videoIdentifier)) {
      console.log('🔎 [saveVideoToGallery] Video already saved, preventing duplicate:', videoIdentifier);
      return true;
    }
    
    // Validate topic - ensure we have a non-empty topic
    const videoTopic = result.topic?.trim() ? result.topic : 'Untitled Video';
    console.log('🔎 [saveVideoToGallery] Using video topic:', videoTopic);
    
    // Calculate expiry time (7 days from now)
    const expiryTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const videoData = {
      user_id: userId,
      topic: videoTopic,
      video_url: result.video_url,
      audio_url: result.audio_url,
      transcript_url: result.transcript_url,
      images_zip_url: result.images_zip_url,
      thumbnail_url: result.thumbnail_url,
      expiry_time: expiryTime
    };
    
    console.log('🔎 [saveVideoToGallery] Formatted video data for insert:', videoData);
    
    const { data, error } = await supabase.from('generated_videos').insert(videoData).select();
    
    if (error) {
      console.error('🔎 [saveVideoToGallery] Error saving video to database:', error);
      console.error('🔎 [saveVideoToGallery] Error details:', error.details, error.hint, error.message);
      toast.error(`Failed to save video to gallery: ${error.message || 'Unknown error'}`);
      return false;
    } else {
      console.log('🔎 [saveVideoToGallery] Video saved successfully:', data);
      // Mark this video as saved to prevent duplicates
      savedVideoIds.add(videoIdentifier);
      toast.success('Video saved to your gallery! Note: Videos are automatically deleted after 7 days.');
      return true;
    }
  } catch (dbError: any) {
    console.error('🔎 [saveVideoToGallery] Exception saving video to database:', dbError);
    toast.error(`Failed to save to gallery: ${dbError.message || 'Unknown error'}`);
    return false;
  }
};

export const getVideos = async (): Promise<VideoData[]> => {
  try {
    console.log('🔎 [getVideos] Fetching videos from database...');
    
    // Get videos from Supabase
    const { data: videos, error } = await supabase
      .from('generated_videos')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('🔎 [getVideos] Error fetching videos from database:', error);
      throw error;
    }
    
    if (!videos || videos.length === 0) {
      console.log('🔎 [getVideos] No videos found in database');
      return [];
    }
    
    console.log(`🔎 [getVideos] Found ${videos.length} videos in database`);
    
    // Map database videos to VideoData format
    const mappedVideos = videos.map(video => {
      const embeddedSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjExMzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzRiNTU2MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlZpZGVvPC90ZXh0Pjwvc3ZnPg==';
      
      return {
        id: video.id,
        title: video.topic || 'Untitled Video',
        prompt: video.topic || 'No topic provided',
        url: video.video_url || '',
        thumbnail: video.thumbnail_url || embeddedSVG,
        created_at: video.created_at,
        audioUrl: video.audio_url,
        transcriptUrl: video.transcript_url,
        imagesZipUrl: video.images_zip_url
      };
    });
    
    console.log('🔎 [getVideos] Mapped videos sample:', mappedVideos[0]);
    return mappedVideos;
  } catch (error) {
    console.error('🔎 [getVideos] Error fetching videos:', error);
    return [];
  }
};
