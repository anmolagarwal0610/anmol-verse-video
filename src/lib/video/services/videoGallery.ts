import { supabase } from '@/integrations/supabase/client';
import { VideoStatusResponse } from '../types';
import { toast } from 'sonner';
import { VideoData } from '@/components/video-card';

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

export const getVideos = async (): Promise<VideoData[]> => {
  try {
    console.log('Fetching videos from database...');
    
    // Get videos from Supabase
    const { data: videos, error } = await supabase
      .from('generated_videos')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching videos from database:', error);
      throw error;
    }
    
    if (!videos || videos.length === 0) {
      console.log('No videos found in database');
      return [];
    }
    
    console.log(`Found ${videos.length} videos in database`);
    
    // Map database videos to VideoData format
    return videos.map(video => {
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
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};
