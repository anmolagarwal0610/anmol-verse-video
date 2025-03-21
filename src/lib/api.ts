import { VideoData } from '@/components/VideoCard';

// Mock data for videos
const MOCK_VIDEOS: VideoData[] = [
  {
    id: '1',
    prompt: 'Sunset over a tropical beach',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3Vuc2V0JTIwYmVhY2h8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    createdAt: '2023-09-01T12:00:00Z',
  },
  {
    id: '2',
    prompt: 'New York City skyline aerial view',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmV3JTIweW9ya3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    createdAt: '2023-08-28T15:30:00Z',
  },
  {
    id: '3',
    prompt: 'Snowy mountain landscape',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c25vd3klMjBtb3VudGFpbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    createdAt: '2023-08-25T09:15:00Z',
  },
  {
    id: '4',
    prompt: 'Coffee brewing in slow motion',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlJTIwYnJld2luZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    createdAt: '2023-08-20T11:45:00Z',
  },
  {
    id: '5',
    prompt: 'Space nebula with colorful stars',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1541873676-a18131494184?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bmVidWxhfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    createdAt: '2023-08-18T14:20:00Z',
  },
  {
    id: '6',
    prompt: 'Busy street market in Tokyo',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHRva3lvJTIwbWFya2V0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    createdAt: '2023-08-15T16:50:00Z',
  },
];

// Configuration for the API
const API_CONFIG = {
  BASE_URL: "https://flask-app-249297598302.asia-south1.run.app" // Flask API URL
};

export const generateVideo = async (prompt: string): Promise<{ videoId: string }> => {
  try {
    // Real API implementation
    const response = await fetch(`${API_CONFIG.BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return { videoId: data.videoId || data.id };
  } catch (error) {
    console.error('Error generating video:', error);
    // For development/fallback - in production you'd want to handle errors differently
    return { videoId: Math.random().toString(36).substring(2, 15) };
  }
};

export const getVideos = async (): Promise<VideoData[]> => {
  try {
    // Real API implementation
    const response = await fetch(`${API_CONFIG.BASE_URL}/videos`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.videos || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    // Fallback to mock data during development
    return MOCK_VIDEOS;
  }
};

export const getVideoById = async (id: string): Promise<VideoData | null> => {
  try {
    // Real API implementation
    const response = await fetch(`${API_CONFIG.BASE_URL}/videos/${id}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching video:', error);
    // Fallback to mock data during development
    const video = MOCK_VIDEOS.find(v => v.id === id);
    return video || null;
  }
};

export const deleteVideo = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/videos/${id}`, {
      method: 'DELETE'
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting video:', error);
    return false;
  }
};

// Updated transcript generation function with better debugging
export const generateTranscript = async (prompt: string): Promise<{ transcript: string }> => {
  try {
    console.log("Sending request to generate transcript with prompt:", prompt);
    console.log("Request URL:", `${API_CONFIG.BASE_URL}/generate_transcript`);
    
    // Make request to the transcript generation endpoint with additional error handling
    const response = await fetch(`${API_CONFIG.BASE_URL}/generate_transcript`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      mode: 'cors' // Explicitly setting CORS mode
    });

    console.log("API Response status:", response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Could not read error response");
      console.error("Error response body:", errorText);
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Parse JSON response safely
    let data;
    try {
      data = await response.json();
      console.log("Transcript API response data:", data);
    } catch (jsonError) {
      console.error("JSON parse error:", jsonError);
      throw new Error("Failed to parse API response as JSON");
    }

    if (!data.transcript_url) {
      console.error("Missing transcript_url in response:", data);
      throw new Error("No transcript URL found in API response");
    }

    console.log("Attempting to fetch transcript from URL:", data.transcript_url);
    
    // Fetch the transcript from the provided URL with additional error handling
    const transcriptResponse = await fetch(data.transcript_url, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      mode: 'cors' // Explicitly setting CORS mode
    });

    console.log("Transcript fetch status:", transcriptResponse.status, transcriptResponse.statusText);
    
    if (!transcriptResponse.ok) {
      const errorText = await transcriptResponse.text().catch(() => "Could not read error response");
      console.error("Transcript fetch error response:", errorText);
      throw new Error(`Failed to fetch transcript: ${transcriptResponse.status} ${transcriptResponse.statusText} - ${errorText}`);
    }

    // Get transcript text with error handling
    let transcriptText;
    try {
      transcriptText = await transcriptResponse.text();
      console.log("Fetched transcript (first 100 chars):", transcriptText.substring(0, 100));
    } catch (textError) {
      console.error("Text extraction error:", textError);
      throw new Error("Failed to extract text from transcript response");
    }
    
    if (!transcriptText || transcriptText.trim() === '') {
      console.error("Empty transcript received");
      throw new Error("Received empty transcript from server");
    }
    
    return { transcript: transcriptText };
  } catch (error) {
    console.error('Error generating transcript:', error);
    // Include the full error details for debugging
    return { 
      transcript: `Failed to generate transcript. Please try again later. Error: ${error.message}` 
    };
  }
};
