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
  image_style?: string[];
  audio_language?: 'English' | 'Hindi';
  voice?: string;
  subtitle_style?: 'Default' | 'Colour gradient' | 'Tilt animation' | 'Karaoke';
  subtitle_script?: 'English' | 'Hindi';
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
  thumbnail_url?: string;
  topic?: string;
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

// Transition styles - Updated with only the 4 required options
export const TRANSITION_STYLES = {
  "fade": "Fade",
  "circleopen": "CircleOpen",
  "radial": "Radial", 
  "slideleft": "SlideLeft"
};

// Subtitle fonts - organized by family with their styles
export const SUBTITLE_FONTS = {
  // DejaVu Sans Family
  "DejaVuSans": "DejaVu Sans Regular",
  "DejaVuSans-Bold": "DejaVu Sans Bold",
  "DejaVuSans-Oblique": "DejaVu Sans Oblique",
  "DejaVuSans-BoldOblique": "DejaVu Sans Bold Oblique",
  "DejaVuSans-ExtraLight": "DejaVu Sans ExtraLight",
  
  // DejaVu Serif Family
  "DejaVuSerif": "DejaVu Serif Regular",
  "DejaVuSerif-Bold": "DejaVu Serif Bold",
  "DejaVuSerif-Italic": "DejaVu Serif Italic",
  "DejaVuSerif-BoldItalic": "DejaVu Serif Bold Italic",
  
  // DejaVu Sans Mono Family
  "DejaVuSansMono": "DejaVu Sans Mono Regular",
  "DejaVuSansMono-Bold": "DejaVu Sans Mono Bold",
  "DejaVuSansMono-Oblique": "DejaVu Sans Mono Oblique",
  "DejaVuSansMono-BoldOblique": "DejaVu Sans Mono Bold Oblique",
  
  // Liberation Sans Family
  "LiberationSans-Regular": "Liberation Sans Regular",
  "LiberationSans-Bold": "Liberation Sans Bold",
  "LiberationSans-Italic": "Liberation Sans Italic",
  "LiberationSans-BoldItalic": "Liberation Sans Bold Italic",
  
  // Liberation Serif Family
  "LiberationSerif-Regular": "Liberation Serif Regular",
  "LiberationSerif-Bold": "Liberation Serif Bold",
  "LiberationSerif-Italic": "Liberation Serif Italic",
  "LiberationSerif-BoldItalic": "Liberation Serif Bold Italic",
  
  // Liberation Mono Family
  "LiberationMono-Regular": "Liberation Mono Regular",
  "LiberationMono-Bold": "Liberation Mono Bold",
  "LiberationMono-Italic": "Liberation Mono Italic",
  "LiberationMono-BoldItalic": "Liberation Mono Bold Italic",
  
  // Lohit Devanagari (for Hindi)
  "Lohit-Devanagari": "Lohit Devanagari"
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

// Audio language options
export const AUDIO_LANGUAGES = {
  "English": "English",
  "Hindi": "Hindi"
};

// Subtitle style options
export const SUBTITLE_STYLES = {
  "Default": "Default",
  "Colour gradient": "Colour gradient",
  "Tilt animation": "Tilt animation",
  "Karaoke": "Karaoke"
};

// Voice options with preview URLs
export interface VoiceOption {
  id: string;
  name: string;
  category: string;
  language: string;
  previewUrl: string;
}

export const VOICE_OPTIONS: Record<string, VoiceOption> = {
  "iiidtqDt9FBdT1vfBluA": {
    id: "iiidtqDt9FBdT1vfBluA",
    name: "Bill L. Oxley",
    category: "Narration",
    language: "English",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/database/user/Bi4YhYxPTDRSUfiEpED4qyJ0biq2/voices/iiidtqDt9FBdT1vfBluA/T36MtmAvwCajW33mBOpD.mp3"
  },
  "21m00Tcm4TlvDq8ikWAM": {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    category: "Narration",
    language: "English",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/9BWtsMINqrJLrRacOk9x/405766b8-1f4e-4d3c-aba1-6f25333823ec.mp3"
  },
  "c6bExSiHfx47LERqW2VK": {
    id: "c6bExSiHfx47LERqW2VK",
    name: "Rhea",
    category: "Late Night Storyteller",
    language: "Hindi",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/database/workspace/ed9b05e6324c457685490352e9a1ec90/voices/c6bExSiHfx47LERqW2VK/2r2vzsjZ9dJL3TenFARf.mp3"
  },
  "IvLWq57RKibBrqZGpQrC": {
    id: "IvLWq57RKibBrqZGpQrC",
    name: "Leo",
    category: "Energetic, Conversational",
    language: "Hindi",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/custom/voices/IvLWq57RKibBrqZGpQrC/Sv8CxRCqu5bIr5DgOp37.mp3"
  },
  "zgqefOY5FPQ3bB7OZTVR": {
    id: "zgqefOY5FPQ3bB7OZTVR",
    name: "Niraj",
    category: "Hindi Narrator",
    language: "Hindi",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/database/workspace/514d94e9241c48e8b7905375729c436f/voices/zgqefOY5FPQ3bB7OZTVR/6oNuCi9jEFU1AWW85Tru.mp3"
  },
  "9BWtsMINqrJLrRacOk9x": {
    id: "9BWtsMINqrJLrRacOk9x",
    name: "Aria",
    category: "Social Media",
    language: "English",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/9BWtsMINqrJLrRacOk9x/405766b8-1f4e-4d3c-aba1-6f25333823ec.mp3"
  },
  "CwhRBWXzGAHq8TQ4Fs17": {
    id: "CwhRBWXzGAHq8TQ4Fs17",
    name: "Roger",
    category: "Social Media",
    language: "English",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3"
  }
};

// Reuse the IMAGE_STYLES from imageApi for image_style parameter
export { IMAGE_STYLES } from './imageApi';
