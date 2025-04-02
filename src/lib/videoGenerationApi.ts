
import { API_CONFIG, fetchWithCorsProxy } from './apiUtils';

export interface VideoGenerationParams {
  username: string;
  topic: string;
  image_model?: string;
  image_ratio?: string;
  video_duration?: number;
  frame_fps?: number;
  subtitle_color?: string;
  subtitle_font?: string;
  video_category?: string;
  transition_style?: string;
}

export interface VideoGenerationResponse {
  status: string;
  task_id: string;
}

export interface VideoStatusResponse {
  status: string;
  message?: string;
  video_url?: string;
  audio_url?: string;
  transcript_url?: string;
  images_zip_url?: string;
}

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

// Categories for video generation
export const VIDEO_CATEGORIES = {
  "Hollywood Script": "Hollywood Script",
  "Educational": "Educational",
  "Marketing": "Marketing",
  "Tutorial": "Tutorial",
  "Travel": "Travel"
};

// Transition styles
export const TRANSITION_STYLES = {
  "fade": "Fade",
  "slide": "Slide",
  "dissolve": "Dissolve",
  "wipe": "Wipe",
  "zoom": "Zoom"
};

// Subtitle fonts
export const SUBTITLE_FONTS = {
  "Arial": "Arial",
  "Helvetica": "Helvetica",
  "Times New Roman": "Times New Roman",
  "Courier New": "Courier New",
  "Verdana": "Verdana",
  "LiberationSans-Regular": "Liberation Sans Regular" // Added new font
};

// Subtitle colors
export const SUBTITLE_COLORS = {
  "white": "White",
  "yellow": "Yellow",
  "black": "Black",
  "red": "Red",
  "blue": "Blue"
};

// Image model options
export const IMAGE_MODELS = {
  "basic": {
    label: "Basic",
    value: "black-forest-labs/FLUX.1-schnell-free",
    description: "Free model for basic image generation"
  },
  "advanced": {
    label: "Advanced",
    value: "black-forest-labs/FLUX.1-schnell",
    description: "Premium model for higher quality image generation"
  }
};

