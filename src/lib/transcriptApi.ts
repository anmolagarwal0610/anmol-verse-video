
import { supabase } from '@/integrations/supabase/client';

export const generateTranscript = async (
  prompt: string, 
  scriptModel: 'chatgpt' | 'deepseek' = 'chatgpt',
  language: 'English' | 'Hindi' | 'Hinglish' = 'English'
): Promise<{ transcript: string, guide: string }> => {
  try {
    console.log("Calling generate-transcript edge function with:", { prompt, scriptModel, language });
    
    // Prepare the request payload
    const payload = {
      prompt: prompt,
      script_model: scriptModel,
      language: language
    };
    
    // Call the Supabase edge function instead of the API directly
    const { data, error } = await supabase.functions.invoke('generate-transcript', {
      body: payload
    });
    
    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Edge function error: ${error.message}`);
    }
    
    console.log("Transcript API response data:", data);

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
      
      // Fetch transcript
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
      
      // Try to fetch guide if available
      if (data.guide_url) {
        console.log("Attempting to fetch guide from URL:", data.guide_url);
        
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
