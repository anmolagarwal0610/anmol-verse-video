
import { API_CONFIG, fetchWithCorsProxy } from './apiUtils';

// Transcript generation function with multiple CORS proxy fallbacks
export const generateTranscript = async (prompt: string): Promise<{ transcript: string }> => {
  try {
    console.log("Sending request to generate transcript with prompt:", prompt);
    
    // Add a timestamp to prevent browser caching
    const timestamp = Date.now();
    const apiUrl = `${API_CONFIG.BASE_URL}/generate_transcript`;
    
    // Prepare the request payload
    const payload = {
      prompt: `${prompt} (${timestamp})`,
      bypass_cors: true
    };
    
    // Prepare request options
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors' as RequestMode,
      cache: 'no-cache' as RequestCache
    };
    
    // Make request with CORS proxy fallback mechanism
    const response = await fetchWithCorsProxy(
      apiUrl,
      requestOptions
    );

    console.log("API Response status:", response.status, response.statusText);
    
    // Parse JSON response safely
    let data;
    try {
      data = await response.json();
      console.log("Transcript API response data:", data);
    } catch (jsonError) {
      console.error("JSON parse error:", jsonError);
      throw new Error("Failed to parse API response as JSON");
    }

    // If the API returns a transcript directly, use it
    if (data.transcript) {
      console.log("Received direct transcript:", data.transcript.substring(0, 100) + "...");
      return { transcript: data.transcript };
    }
    
    // Handle case where API returns a URL to fetch the transcript
    if (data.transcript_url) {
      console.log("Attempting to fetch transcript from URL:", data.transcript_url);
      
      // Fetch the transcript from the provided URL through the CORS proxy
      const transcriptResponse = await fetchWithCorsProxy(
        data.transcript_url,
        {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          mode: 'cors',
          cache: 'no-cache'
        }
      );
      
      console.log("Transcript fetch status:", transcriptResponse.status);
      
      // Get transcript text with error handling
      const transcriptText = await transcriptResponse.text();
      console.log("Fetched transcript (first 100 chars):", transcriptText.substring(0, 100));
      
      if (!transcriptText || transcriptText.trim() === '') {
        throw new Error("Received empty transcript from server");
      }
      
      return { transcript: transcriptText };
    }
    
    // If we reach here, the API didn't provide either a transcript or a URL
    throw new Error("Invalid API response: No transcript or transcript_url found");
    
  } catch (error) {
    console.error('Error generating transcript:', error);
    return { 
      transcript: `Failed to generate transcript. Error: ${error.message}` 
    };
  }
};
