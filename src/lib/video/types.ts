
// Remove the circular import
export interface VideoGenerationParams {
  script_model: string;
  topic: string;
  image_model: string;
  image_ratio: string;
  image_pixel: string;
  pixelOption: string;
  pixelOptionValue?: string;
  video_duration: number;
  frame_fps: number;
  subtitle_color: string;
  subtitle_font: string;
  video_category: string;
  transition_style: string;
  image_style: string[];
  audio_language: string;
  voice: string;
  subtitle_style: string;
  subtitle_script: string;
  [key: string]: any;
}

export interface VideoGenerationResponse {
  task_id: string;
  message?: string;
  error?: string;
  original_params?: VideoGenerationParams;
}

export interface VideoStatusResponse {
  task_id: string;
  status: string;
  progress: number;
  message?: string;
  video_url?: string;
  audio_url?: string;
  transcript_url?: string;
  images_zip_url?: string;
  thumbnail_url?: string;
  error?: string;
  topic?: string;
  frame_fps?: number;
  audio_duration?: number;
  voice?: string;
  original_params?: VideoGenerationParams;
}
