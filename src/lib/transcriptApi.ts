
import { API_CONFIG, fetchWithCorsProxy } from './apiUtils';

export const generateTranscript = async (
  prompt: string, 
  scriptModel: 'chatgpt' | 'deepseek' = 'chatgpt',
  language: 'English' | 'Hindi' | 'Hinglish' = 'English'
): Promise<{ transcript: string, guide: string }> => {
  try {
    console.log("Sending request to generate transcript with:", { prompt, scriptModel, language });
    
    const apiUrl = `${API_CONFIG.BASE_URL}/generate_transcript`;
    
    // Prepare the request payload
    const payload = {
      prompt: prompt,
      script_model: scriptModel,
      language: language
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
    
    // Try making a direct request first, as the server now has proper CORS headers
    try {
      console.log("Attempting direct request to:", apiUrl);
      const response = await fetch(apiUrl, requestOptions);
      console.log("Direct API Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Direct API response data:", data);
        
        // Handle direct transcript in response
        if (data.transcript) {
          return { 
            transcript: data.transcript,
            guide: data.guide || ''
          };
        }
        
        // Handle transcript_url and guide_url in response
        if (data.transcript_url) {
          console.log("Fetching transcript from URL:", data.transcript_url);
          let transcriptText = '';
          let guideText = '';
          
          // Fetch transcript
          const transcriptResponse = await fetch(data.transcript_url);
          if (transcriptResponse.ok) {
            transcriptText = await transcriptResponse.text();
            console.log("Fetched transcript (first 100 chars):", transcriptText.substring(0, 100));
          }
          
          // Fetch guide if available
          if (data.guide_url) {
            console.log("Fetching guide from URL:", data.guide_url);
            const guideResponse = await fetch(data.guide_url);
            if (guideResponse.ok) {
              guideText = await guideResponse.text();
              console.log("Fetched guide (first 100 chars):", guideText.substring(0, 100));
            }
          }
          
          return { 
            transcript: transcriptText,
            guide: guideText
          };
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
      return { 
        transcript: data.transcript,
        guide: data.guide || ''
      };
    }
    
    // Handle case where API returns URLs to fetch the transcript and guide
    if (data.transcript_url) {
      console.log("Attempting to fetch transcript from URL:", data.transcript_url);
      let transcriptText = '';
      let guideText = '';
      
      // Try direct fetch for transcript
      try {
        const transcriptResponse = await fetch(data.transcript_url, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (transcriptResponse.ok) {
          transcriptText = await transcriptResponse.text();
          console.log("Fetched transcript (first 100 chars):", transcriptText.substring(0, 100));
        }
      } catch (directFetchError) {
        console.error("Direct transcript fetch failed:", directFetchError);
        // Fall back to proxy for transcript
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
        
        transcriptText = await transcriptResponse.text();
      }
      
      // Try to fetch guide if available
      if (data.guide_url) {
        console.log("Attempting to fetch guide from URL:", data.guide_url);
        
        try {
          const guideResponse = await fetch(data.guide_url, {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (guideResponse.ok) {
            guideText = await guideResponse.text();
            console.log("Fetched guide (first 100 chars):", guideText.substring(0, 100));
          }
        } catch (directGuideFetchError) {
          console.error("Direct guide fetch failed:", directGuideFetchError);
          // Fall back to proxy for guide
          try {
            const guideResponse = await fetchWithCorsProxy(
              data.guide_url,
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
            
            guideText = await guideResponse.text();
          } catch (proxyGuideFetchError) {
            console.error("Proxy guide fetch failed:", proxyGuideFetchError);
            // Continue without guide if it fails
          }
        }
      }
      
      if (!transcriptText || transcriptText.trim() === '') {
        throw new Error("Received empty transcript from server");
      }
      
      return { 
        transcript: transcriptText,
        guide: guideText
      };
    }
    
    // If we reach here, the API didn't provide either a transcript or a URL
    throw new Error("Invalid API response: No transcript or transcript_url found");
    
  } catch (error) {
    console.error('Error generating transcript:', error);
    return { 
      transcript: `Failed to generate transcript. Error: ${error.message}`,
      guide: '' 
    };
  }
};
