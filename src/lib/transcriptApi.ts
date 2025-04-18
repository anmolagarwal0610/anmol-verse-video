import { API_CONFIG, fetchWithCorsProxy } from './apiUtils';

export const generateTranscript = async (
  prompt: string, 
  scriptModel: 'chatgpt' | 'deepseek' = 'chatgpt'
): Promise<{ transcript: string }> => {
  try {
    console.log("Sending request to generate transcript with:", { prompt, scriptModel });
    
    const apiUrl = `${API_CONFIG.BASE_URL}/generate_transcript`;
    
    // Prepare the request payload
    const payload = {
      prompt: prompt,
      script_model: scriptModel // Add script model to payload
    };
    
    // Prepare request options
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors' as RequestMode,
      cache: 'no-cache' as RequestCache
    };
    
    // Try making a direct request first, as the server now has proper CORS headers
    try {
      console.log("Attempting direct request to:", apiUrl);
      const response = await fetch(apiUrl, requestOptions);
      console.log("Direct API Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Direct API response data:", data);
        
        if (data.transcript) {
          return { transcript: data.transcript };
        }
        
        if (data.transcript_url) {
          console.log("Fetching transcript from URL:", data.transcript_url);
          const transcriptResponse = await fetch(data.transcript_url);
          const transcriptText = await transcriptResponse.text();
          console.log("Fetched transcript (first 100 chars):", transcriptText.substring(0, 100));
          return { transcript: transcriptText };
        }
      }
      // If direct request fails, continue to proxy fallbacks
      console.log("Direct request failed, trying proxies");
    } catch (directError) {
      console.error("Direct API request failed:", directError);
      // Continue to proxy fallbacks
    }
    
    // If direct request fails, fall back to CORS proxies
    console.log("Falling back to CORS proxies");
    const response = await fetchWithCorsProxy(apiUrl, requestOptions);
    
    console.log("Proxy API Response status:", response.status);
    
    let data;
    try {
      data = await response.json();
      console.log("Transcript API response data:", data);
    } catch (jsonError) {
      console.error("JSON parse error:", jsonError);
      throw new Error("Failed to parse API response as JSON");
    }

    // Check for error in the response
    if (data.error) {
      console.error("API returned error:", data.error);
      throw new Error(`API error: ${data.error}`);
    }

    // If the API returns a transcript directly, use it
    if (data.transcript) {
      console.log("Received direct transcript:", data.transcript.substring(0, 100) + "...");
      return { transcript: data.transcript };
    }
    
    // Handle case where API returns a URL to fetch the transcript
    if (data.transcript_url) {
      console.log("Attempting to fetch transcript from URL:", data.transcript_url);
      
      // Try direct fetch first
      try {
        const transcriptResponse = await fetch(data.transcript_url, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (transcriptResponse.ok) {
          const transcriptText = await transcriptResponse.text();
          console.log("Fetched transcript (first 100 chars):", transcriptText.substring(0, 100));
          return { transcript: transcriptText };
        }
      } catch (directFetchError) {
        console.error("Direct transcript fetch failed:", directFetchError);
        // Fall back to proxy
      }
      
      // If direct fetch fails, try with proxy
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
