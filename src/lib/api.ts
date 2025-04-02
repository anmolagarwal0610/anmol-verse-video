
// Re-export everything from the modular API files
export { API_CONFIG, fetchWithCorsProxy } from './apiUtils';
export { MOCK_VIDEOS } from './mockData';
export { generateVideo as generateExistingVideo, getVideos, getVideoById, deleteVideo } from './videoApi';
export { generateTranscript } from './transcriptApi';
export { 
  generateImage, 
  calculateDimensions, 
  IMAGE_STYLES,
  MODEL_DESCRIPTIONS,
  ASPECT_RATIOS
} from './imageApi';
export type { 
  ImageGenerationParams,
  GeneratedImage,
  ImageGenerationResponse
} from './imageApi';

// Export the new video generation API
export { 
  generateVideo,
  checkVideoStatus,
  VIDEO_CATEGORIES,
  TRANSITION_STYLES,
  SUBTITLE_FONTS,
  SUBTITLE_COLORS,
  IMAGE_MODELS
} from './videoGenerationApi';
export type {
  VideoGenerationParams,
  VideoGenerationResponse,
  VideoStatusResponse
} from './videoGenerationApi';
