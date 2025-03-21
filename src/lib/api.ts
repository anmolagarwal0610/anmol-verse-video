
// Re-export everything from the modular API files
export { API_CONFIG, fetchWithCorsProxy } from './apiUtils';
export { MOCK_VIDEOS } from './mockData';
export { generateVideo, getVideos, getVideoById, deleteVideo } from './videoApi';
export { generateTranscript } from './transcriptApi';
