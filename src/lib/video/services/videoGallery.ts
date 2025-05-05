
import { supabase } from '@/integrations/supabase/client';
import { VideoStatusResponse } from '../types';
import { toast } from 'sonner';
import { VideoData } from '@/components/video-card';

// Track saved video URLs to prevent duplicate saves (in-memory cache)
const savedVideoUrls = new Set<string>();

export const saveVideoToGallery = async (
  result: VideoStatusResponse, 
  userId: string
): Promise<boolean> => {
  try {
    console.log('🔎 [saveVideoToGallery] Starting save operation with userId:', userId);
    console.log('🔎 [saveVideoToGallery] Result object:', result);
    
    // Skip if no video URL (indicates incomplete generation)
    if (!result.video_url) {
      console.warn('🔎 [saveVideoToGallery] No video URL provided, skipping save');
      return false;
    }
    
    // Create a unique identifier based on video URL
    const videoUrl = result.video_url;
    
    // Check if we've already saved this video URL in this session
    if (savedVideoUrls.has(videoUrl)) {
      console.log('🔎 [saveVideoToGallery] Video already saved in this session, preventing duplicate');
      return true;
    }
    
    // Check if this video URL already exists in the database
    const { data: existingVideos, error: checkError } = await supabase
      .from('generated_videos')
      .select('id, video_url')
      .eq('video_url', videoUrl)
      .limit(1);
      
    if (checkError) {
      console.error('🔎 [saveVideoToGallery] Error checking for existing video:', checkError);
    } else if (existingVideos && existingVideos.length > 0) {
      console.log('🔎 [saveVideoToGallery] Video with this URL already exists in database');
      // Mark as saved in our memory cache
      savedVideoUrls.add(videoUrl);
      return true;
    }

    // Validate topic - ensure we have a non-empty topic
    let videoTopic = 'Untitled Video';
    
    // Enhanced topic validation and logging
    if (result.topic) {
      console.log('🔎 [saveVideoToGallery] Raw topic from result:', result.topic);
      const trimmedTopic = result.topic.trim();
      if (trimmedTopic) {
        videoTopic = trimmedTopic;
        console.log('🔎 [saveVideoToGallery] Using valid topic:', videoTopic);
      } else {
        console.warn('🔎 [saveVideoToGallery] Topic was empty after trimming');
      }
    } else {
      console.warn('🔎 [saveVideoToGallery] No topic provided in result object');
    }
    
    // Calculate expiry time (7 days from now)
    const expiryTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    // Insert the video into the database
    const { data, error } = await supabase
      .from('generated_videos')
      .insert({
        user_id: userId,
        topic: videoTopic,
        video_url: videoUrl,
        audio_url: result.audio_url,
        transcript_url: result.transcript_url,
        images_zip_url: result.images_zip_url,
        thumbnail_url: result.thumbnail_url,
        expiry_time: expiryTime
      })
      .select();
    
    if (error) {
      console.error('🔎 [saveVideoToGallery] Error saving video to database:', error);
      toast.error(`Failed to save video to gallery: ${error.message || 'Unknown error'}`);
      return false;
    } else {
      console.log('🔎 [saveVideoToGallery] Video saved successfully with topic:', videoTopic);
      console.log('🔎 [saveVideoToGallery] Database response:', data);
      // Mark this video URL as saved to prevent duplicates in this session
      savedVideoUrls.add(videoUrl);
      toast.success('Video saved to your gallery! Videos are automatically deleted after 7 days.');
      return true;
    }
    
  } catch (err) {
    console.error('🔎 [saveVideoToGallery] Exception saving video to database:', err);
    toast.error(`Failed to save to gallery: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
    
    // Log a few video URLs for debugging
    if (videos.length > 0) {
      console.log('🔎 [getVideos] Sample video_url from database:', videos[0].video_url);
      console.log('🔎 [getVideos] Sample topic from database:', videos[0].topic);
    }
    
    // Map database videos to VideoData format
    const mappedVideos = videos.map(video => {
      // Embedded SVG as reliable fallback
      const embeddedSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjExMzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzRiNTU2MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlZpZGVvPC90ZXh0Pjwvc3ZnPg==';
      
      // Verify video URL and log it for debugging
      const videoUrl = video.video_url || '';
      if (!videoUrl) {
        console.warn('🔎 [getVideos] Video missing URL:', video.id);
      } else {
        console.log('🔎 [getVideos] Video URL for ID', video.id, ':', videoUrl);
      }
      
      // Make sure we have a title, even if topic is null/empty
      const title = video.topic && video.topic.trim() ? video.topic : 'Untitled Video';
      console.log('🔎 [getVideos] Using title for video', video.id, ':', title);
      
      return {
        id: video.id,
        title: title,
        prompt: title,
        url: videoUrl,
        thumbnail: video.thumbnail_url || embeddedSVG,
        created_at: video.created_at,
        audioUrl: video.audio_url,
        transcriptUrl: video.transcript_url,
        imagesZipUrl: video.images_zip_url
      };
    });
    
    return mappedVideos;
  } catch (error) {
    console.error('🔎 [getVideos] Error fetching videos:', error);
    return [];
  }
};
