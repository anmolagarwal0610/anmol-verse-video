
export interface VideoGenerationParams {
  username?: string;
  topic: string;
  script_model?: string;
  image_model?: string;
  image_ratio?: string;
  image_pixel?: number;
  pixelOption?: string;
  pixelOptionValue?: number;
  video_duration?: number;
  frame_fps?: number;
  subtitle_color?: string;
  subtitle_font?: string;
  video_category?: string;
  transition_style?: string;
  image_style?: string[];
  audio_language?: string;
  voice?: string;
  subtitle_style?: string;
  subtitle_script?: string;
}

export interface VideoGenerationResponse {
  status: string;
  task_id: string;
  originalTopic?: string; // Add this field to support the topic preservation
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
  audio_duration?: number;
  voice?: string;
  frame_fps?: number;
  task_id?: string; 
  originalTopic?: string; // Add this field to support the topic preservation
}
