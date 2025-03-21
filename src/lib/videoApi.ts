
import { VideoData } from '@/components/VideoCard';
import { API_CONFIG } from './apiUtils';
import { MOCK_VIDEOS } from './mockData';

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
    // Real API implementation
    const response = await fetch(`${API_CONFIG.BASE_URL}/videos`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.videos || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    // Fallback to mock data during development
    return MOCK_VIDEOS;
  }
};

export const getVideoById = async (id: string): Promise<VideoData | null> => {
  try {
    // Real API implementation
    const response = await fetch(`${API_CONFIG.BASE_URL}/videos/${id}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching video:', error);
    // Fallback to mock data during development
    const video = MOCK_VIDEOS.find(v => v.id === id);
    return video || null;
  }
};

export const deleteVideo = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/videos/${id}`, {
      method: 'DELETE'
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting video:', error);
    return false;
  }
};
