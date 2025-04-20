
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
      script_model: scriptModel
    };
    
    // Prepare request options with API key
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': API_CONFIG.API_KEY
      },
      body: JSON.stringify(payload),
      mode: 'cors' as RequestMode,
      cache: 'no-cache' as RequestCache
    };
    
    // Try making a direct request with better error handling
    try {
      const response = await fetch(apiUrl, requestOptions);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.transcript) {
          return { transcript: data.transcript };
        }
        
        if (data.transcript_url) {
          const transcriptResponse = await fetch(data.transcript_url);
          const transcriptText = await transcriptResponse.text();
          return { transcript: transcriptText };
        }
      }
      
      // If direct request fails with status code, throw error with status
      throw new Error(`API request failed with status ${response.status}`);
    } catch (directError) {
      console.warn("Direct API request failed, trying proxy:", directError);
      // Continue to proxy fallbacks
    }
    
    // Fall back to CORS proxy with better error handling
    const response = await fetchWithCorsProxy(apiUrl, requestOptions);
    
    if (!response.ok) {
      throw new Error(`Proxy API request failed with status ${response.status}`);
    }
    
    const data = await response.json();

    // Check for error in the response
    if (data.error) {
      throw new Error(`API error: ${data.error}`);
    }

    // If the API returns a transcript directly, use it
    if (data.transcript) {
      return { transcript: data.transcript };
    }
    
    // Handle case where API returns a URL to fetch the transcript
    if (data.transcript_url) {
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
          return { transcript: transcriptText };
        }
        
        throw new Error(`Transcript fetch failed with status ${transcriptResponse.status}`);
      } catch (fetchError) {
        // Fall back to proxy for transcript URL
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
        
        if (!transcriptResponse.ok) {
          throw new Error(`Transcript proxy fetch failed with status ${transcriptResponse.status}`);
        }
        
        const transcriptText = await transcriptResponse.text();
        
        if (!transcriptText || transcriptText.trim() === '') {
          throw new Error("Received empty transcript from server");
        }
        
        return { transcript: transcriptText };
      }
    }
    
    throw new Error("Invalid API response: No transcript or transcript_url found");
    
  } catch (error: any) {
    console.error('Error generating transcript:', error);
    return { 
      transcript: `Failed to generate transcript. Error: ${error.message}` 
    };
  }
};
