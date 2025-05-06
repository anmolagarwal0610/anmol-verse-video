
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
    console.log('[VIDEO GALLERY] Starting save operation with userId:', userId);
    console.log('[VIDEO GALLERY] Result object received:', JSON.stringify(result, null, 2));
    
    // Skip if no video URL (indicates incomplete generation)
    if (!result.video_url) {
      console.warn('[VIDEO GALLERY] No video URL provided, skipping save');
      return false;
    }
    
    // Create a unique identifier based on video URL
    const videoUrl = result.video_url;
    
    // Check if we've already saved this video URL in this session
    if (savedVideoUrls.has(videoUrl)) {
      console.log('[VIDEO GALLERY] Video already saved in this session, preventing duplicate');
      return true;
    }
    
    // Check if this video URL already exists in the database
    const { data: existingVideos, error: checkError } = await supabase
      .from('generated_videos')
      .select('id, video_url')
      .eq('video_url', videoUrl)
      .limit(1);
      
    if (checkError) {
      console.error('[VIDEO GALLERY] Error checking for existing video:', checkError);
    } else if (existingVideos && existingVideos.length > 0) {
      console.log('[VIDEO GALLERY] Video with this URL already exists in database');
      // Mark as saved in our memory cache
      savedVideoUrls.add(videoUrl);
      return true;
    }

    // TOPIC DETERMINATION - use a clear priority order:
    // 1. Try to get from sessionStorage first (highest priority)
    // 2. originalTopic field from the result
    // 3. topic field if it's not "Untitled Video"
    // 4. task_id as a fallback
    // 5. "Untitled Video" as last resort
    
    // Try to get the last saved topic from sessionStorage
    let storedTopic = '';
    try {
      storedTopic = sessionStorage.getItem('originalVideoTopic') || '';
      console.log('[VIDEO GALLERY] Topic from sessionStorage:', storedTopic);
    } catch (e) {
      console.error('[VIDEO GALLERY] Error reading from sessionStorage:', e);
    }
    
    console.log('[VIDEO GALLERY] Topic determination data:', {
      sessionStorageTopic: storedTopic,
      originalTopic: result.originalTopic || 'not provided',
      topicField: result.topic,
      taskId: result.task_id
    });
    
    let videoTopic = 'Untitled Video';
    
    // First priority: sessionStorage
    if (storedTopic && storedTopic.trim() && storedTopic.trim() !== 'Untitled Video') {
      videoTopic = storedTopic.trim();
      console.log('[VIDEO GALLERY] Using sessionStorage for title:', videoTopic);
    }
    // Second priority: originalTopic field (explicitly stored from form input)
    else if (result.originalTopic && result.originalTopic.trim() && result.originalTopic.trim() !== 'Untitled Video') {
      videoTopic = result.originalTopic.trim();
      console.log('[VIDEO GALLERY] Using originalTopic field for title:', videoTopic);
    }
    // Third priority: topic field if valid
    else if (result.topic && result.topic.trim() && result.topic.trim() !== 'Untitled Video') {
      videoTopic = result.topic.trim();
      console.log('[VIDEO GALLERY] Using topic field for title:', videoTopic);
    }
    // Fourth priority: task_id as fallback
    else if (result.task_id) {
      videoTopic = `Video ${result.task_id.substring(0, 8)}`;
      console.log('[VIDEO GALLERY] Using task_id for title fallback:', videoTopic);
    }
    
    console.log('[VIDEO GALLERY] Final topic being used for save:', videoTopic);
    
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
      console.error('[VIDEO GALLERY] Error saving video to database:', error);
      toast.error(`Failed to save video to gallery: ${error.message || 'Unknown error'}`);
      return false;
    } else {
      console.log('[VIDEO GALLERY] Video saved successfully with topic:', videoTopic);
      console.log('[VIDEO GALLERY] Database response:', data);
      // Mark this video URL as saved to prevent duplicates in this session
      savedVideoUrls.add(videoUrl);
      toast.success('Video saved to your gallery! Videos are automatically deleted after 7 days.');
      return true;
    }
    
  } catch (err) {
    console.error('[VIDEO GALLERY] Exception saving video to database:', err);
    toast.error(`Failed to save to gallery: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return false;
  }
};

export const getVideos = async (): Promise<VideoData[]> => {
  try {
    console.log('[VIDEO GALLERY] Fetching videos from database...');
    
    // Get videos from Supabase
    const { data: videos, error } = await supabase
      .from('generated_videos')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('[VIDEO GALLERY] Error fetching videos from database:', error);
      throw error;
    }
    
    if (!videos || videos.length === 0) {
      console.log('[VIDEO GALLERY] No videos found in database');
      return [];
    }
    
    console.log(`[VIDEO GALLERY] Found ${videos.length} videos in database`);
    
    // Log all video topics to identify the issue
    videos.forEach((video, index) => {
      console.log(`[VIDEO GALLERY] Video ${index} topic: "${video.topic}"`);
    });
    
    // Map database videos to VideoData format
    const mappedVideos = videos.map(video => {
      // Embedded SVG as reliable fallback
      const embeddedSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjExMzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzRiNTU2MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlZpZGVvPC90ZXh0Pjwvc3ZnPg==';
      
      // Verify video URL and log it for debugging
      const videoUrl = video.video_url || '';
      if (!videoUrl) {
        console.warn('[VIDEO GALLERY] Video missing URL:', video.id);
      }
      
      // Make sure we have a title, even if topic is null/empty
      const title = video.topic && video.topic.trim() && video.topic !== 'Untitled Video' 
        ? video.topic 
        : 'Untitled Video';
      console.log('[VIDEO GALLERY] Using title for video', video.id, ':', title);
      
      return {
        id: video.id,
        title: title,
        prompt: title, // Use title as prompt for consistency
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
    console.error('[VIDEO GALLERY] Error fetching videos:', error);
    return [];
  }
};
