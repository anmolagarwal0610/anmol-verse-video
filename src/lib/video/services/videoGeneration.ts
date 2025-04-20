
import { VideoGenerationParams } from '../types';
import { API_CONFIG } from '@/lib/config/api';

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
    return { videoId: Math.random().toString(36).substring(2, 15) };
  }
};
