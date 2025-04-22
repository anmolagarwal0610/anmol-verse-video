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
  script_model?: 'chatgpt' | 'deepseek';
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
