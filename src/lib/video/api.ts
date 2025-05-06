
import { API_CONFIG } from '../apiUtils';
import type { VideoGenerationParams, VideoGenerationResponse, VideoStatusResponse } from './types';

export const generateVideo = async (params: VideoGenerationParams): Promise<VideoGenerationResponse> => {
  try {
    console.log("[VIDEO API] Generating video with params:", params);
    console.log("[VIDEO API] Topic being sent to API:", params.topic);
    
    // Normalize Google voice IDs by removing language suffixes
    let normalizedParams = { ...params };
    if (normalizedParams.voice?.startsWith('google_')) {
      // Extract the base voice type (google_male or google_female) by removing any language suffix
      const baseVoiceType = normalizedParams.voice.match(/^(google_male|google_female)/)?.[0];
      if (baseVoiceType) {
        console.log(`[VIDEO API] Normalizing voice ID from ${normalizedParams.voice} to ${baseVoiceType}`);
        normalizedParams.voice = baseVoiceType;
      }
    }
    
    const apiUrl = `${API_CONFIG.BASE_URL}/generate_video`;
    
    // Prepare request options with API key
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_CONFIG.API_KEY
      },
      body: JSON.stringify(normalizedParams),
    };
    
    console.log("[VIDEO API] Sending video generation request to API:", apiUrl);
    console.log("[VIDEO API] With normalized voice parameter:", normalizedParams.voice);
    console.log("[VIDEO API] With topic parameter:", normalizedParams.topic);
    
    // Make the request
    const response = await fetch(apiUrl, requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    console.log("[VIDEO API] Video generation response:", data);
    
    return data;
  } catch (error) {
    console.error('[VIDEO API] Error generating video:', error);
    throw error;
  }
};

export const checkVideoStatus = async (taskId: string): Promise<VideoStatusResponse> => {
  try {
    console.log("[VIDEO API] Checking video status for task:", taskId);
    
    const apiUrl = `${API_CONFIG.BASE_URL}/check_status?task_id=${taskId}`;
    
    // Add API key to status check request
    const requestOptions = {
      headers: {
        'x-api-key': API_CONFIG.API_KEY
      }
    };
    
    // Make the request with API key
    const response = await fetch(apiUrl, requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    console.log("[VIDEO API] Video status response:", data);
    console.log("[VIDEO API] Topic in status response:", data.topic);
    
    // Add the task_id to the response so it's available throughout the app
    return {
      ...data,
      task_id: taskId
    };
  } catch (error) {
    console.error('[VIDEO API] Error checking video status:', error);
    throw error;
  }
};
