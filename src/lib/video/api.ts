
import { API_CONFIG } from '../apiUtils';
import type { VideoGenerationParams, VideoGenerationResponse, VideoStatusResponse } from './types';

export const generateVideo = async (params: VideoGenerationParams): Promise<VideoGenerationResponse> => {
  try {
    console.log("Generating video with params:", params);
    
    const apiUrl = `${API_CONFIG.BASE_URL}/generate_video`;
    
    // Prepare request options
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params),
    };
    
    console.log("Sending video generation request to API:", apiUrl);
    
    // Make the request
    const response = await fetch(apiUrl, requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Video generation response:", data);
    
    return data;
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
};

export const checkVideoStatus = async (taskId: string): Promise<VideoStatusResponse> => {
  try {
    console.log("Checking video status for task:", taskId);
    
    const apiUrl = `${API_CONFIG.BASE_URL}/check_status?task_id=${taskId}`;
    
    // Make the request
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Video status response:", data);
    
    return data;
  } catch (error) {
    console.error('Error checking video status:', error);
    throw error;
  }
};

