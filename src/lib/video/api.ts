
import { supabase } from '@/integrations/supabase/client';
import type { VideoGenerationParams, VideoGenerationResponse, VideoStatusResponse } from './types';

export const generateVideo = async (params: VideoGenerationParams): Promise<VideoGenerationResponse> => {
  try {
    console.log("[VIDEO API] Generating video with params:", params);
    console.log("[VIDEO API] Topic being sent to API:", params.topic);
    
    // Store original topic in sessionStorage as backup
    try {
      sessionStorage.setItem('originalVideoTopic', params.topic);
      console.log("[VIDEO API] Original topic stored in sessionStorage:", params.topic);
    } catch (e) {
      console.error("[VIDEO API] Failed to store topic in sessionStorage:", e);
    }
    
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
    
    console.log("[VIDEO API] Calling generate-video edge function");
    console.log("[VIDEO API] With normalized voice parameter:", normalizedParams.voice);
    console.log("[VIDEO API] With topic parameter:", normalizedParams.topic);
    
    // Call the Supabase edge function instead of the API directly
    const { data, error } = await supabase.functions.invoke('generate-video', {
      body: normalizedParams
    });
    
    if (error) {
      console.error('[VIDEO API] Edge function error:', error);
      throw new Error(`Edge function error: ${error.message}`);
    }
    
    console.log("[VIDEO API] Video generation response:", data);
    
    // Add the original topic to the response to preserve it throughout the process
    const enrichedResponse: VideoGenerationResponse = {
      ...data,
      originalTopic: params.topic
    };
    
    console.log("[VIDEO API] Enriched response with originalTopic:", enrichedResponse);
    
    return enrichedResponse;
  } catch (error) {
    console.error('[VIDEO API] Error generating video:', error);
    throw error;
  }
};

export const checkVideoStatus = async (taskId: string, originalTopic?: string): Promise<VideoStatusResponse> => {
  try {
    console.log("[VIDEO API] Checking video status for task:", taskId);
    console.log("[VIDEO API] Original topic (if provided):", originalTopic || "Not provided");
    
    // Try to get the topic from sessionStorage as fallback
    if (!originalTopic) {
      try {
        const storedTopic = sessionStorage.getItem('originalVideoTopic');
        if (storedTopic) {
          originalTopic = storedTopic;
          console.log("[VIDEO API] Retrieved topic from sessionStorage:", originalTopic);
        }
      } catch (e) {
        console.error("[VIDEO API] Failed to retrieve topic from sessionStorage:", e);
      }
    }
    
    // Call the Supabase edge function instead of the API directly
    const { data, error } = await supabase.functions.invoke('check-video-status', {
      body: { videoId: taskId }
    });
    
    if (error) {
      console.error('[VIDEO API] Edge function error:', error);
      throw new Error(`Edge function error: ${error.message}`);
    }
    
    console.log("[VIDEO API] Video status response:", data);
    
    // If the API returns "Untitled Video" but we have an original topic, use the original topic
    const finalTopic = (originalTopic && originalTopic.trim() && originalTopic !== "Untitled Video")
      ? originalTopic
      : (data.topic && data.topic !== "Untitled Video")
        ? data.topic
        : "Untitled Video";
        
    console.log("[VIDEO API] Final topic determination:", {
      originalTopic,
      responseTopic: data.topic,
      finalTopic
    });
    
    // Add the task_id and originalTopic to the response
    const enrichedResponse: VideoStatusResponse = {
      ...data,
      topic: finalTopic,
      originalTopic: originalTopic,
      task_id: taskId
    };
    
    console.log("[VIDEO API] Enriched status response:", enrichedResponse);
    
    return enrichedResponse;
  } catch (error) {
    console.error('[VIDEO API] Error checking video status:', error);
    throw error;
  }
};
