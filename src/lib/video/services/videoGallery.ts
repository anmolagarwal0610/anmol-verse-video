
import { supabase } from '@/integrations/supabase/client';
import { VideoData } from '@/components/video-card';
import { MOCK_VIDEOS } from '@/lib/mockData';

export const getVideos = async (): Promise<VideoData[]> => {
  try {
    console.log('getVideos: Starting to fetch videos');
    
    const { data: { user } } = await supabase.auth.getUser();
    console.log('getVideos: Current user:', user?.id);
    
    if (!user) {
      console.log('getVideos: No authenticated user, returning mock videos');
      return MOCK_VIDEOS;
    }
    
    console.log('getVideos: Querying Supabase...');
    const { data: supabaseVideos, error } = await supabase
      .from('generated_videos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('getVideos: Supabase error fetching videos:', error);
      throw error;
    }
    
    if (supabaseVideos && supabaseVideos.length > 0) {
      const embeddedSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjExMzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzRiNTU2MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlZpZGVvPC90ZXh0Pjwvc3ZnPg==';
      
      return supabaseVideos.map(video => ({
        id: video.id,
        title: video.topic || 'Untitled Video',
        prompt: video.topic || '',
        url: video.video_url || '',
        thumbnail: video.thumbnail_url || embeddedSVG,
        created_at: video.created_at || new Date().toISOString(),
        audioUrl: video.audio_url || undefined,
        transcriptUrl: video.transcript_url || undefined,
        imagesZipUrl: video.images_zip_url || undefined
      }));
    }
    
    return [];
  } catch (error) {
    console.error('getVideos: Error fetching videos:', error);
    const { data: { user } } = await supabase.auth.getUser();
    return user ? [] : MOCK_VIDEOS;
  }
};

