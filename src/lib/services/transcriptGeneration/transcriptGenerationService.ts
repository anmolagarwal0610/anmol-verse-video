
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { generateTranscript } from '@/lib/transcriptApi';

// Define interface for transcript generation options
export interface TranscriptGenerationOptions {
  prompt: string;
  scriptModel: 'chatgpt' | 'deepseek';
  language: 'English' | 'Hindi' | 'Hinglish';
}

// Define interface for transcript generation result
export interface TranscriptGenerationResult {
  transcript: string;
  guide: string;
  success: boolean;
}

// Fixed credit cost for transcript generation
export const TRANSCRIPT_CREDIT_COST = 3;

/**
 * Function to use the appropriate number of credits for transcript generation
 */
async function useTranscriptCredits(userId: string): Promise<boolean> {
  try {
    console.log(`Attempting to use ${TRANSCRIPT_CREDIT_COST} credits for transcript generation`);
    
    // Use multiple credits at once (3 credits per transcript)
    const { data, error } = await (supabase.rpc as any)('use_multiple_credits', {
      user_id: userId,
      credit_amount: TRANSCRIPT_CREDIT_COST
    });
    
    if (error) {
      console.error('Error using credits for transcript:', error);
      toast.error(`Not enough credits. Transcript generation requires ${TRANSCRIPT_CREDIT_COST} credits.`);
      return false;
    }
    
    return data === true;
  } catch (error: any) {
    console.error('Unexpected error using credits for transcript:', error);
    toast.error(error.message || 'An unexpected error occurred');
    return false;
  }
}

/**
 * Main entry point for generating transcripts
 */
export async function generateTranscriptFromPrompt(
  options: TranscriptGenerationOptions,
  userId?: string
): Promise<TranscriptGenerationResult | null> {
  try {
    console.log('Starting transcript generation process with options:', options);
    
    // Early return if no user ID
    if (!userId) {
      toast.error('Authentication required to generate transcripts');
      return null;
    }
    
    // Credit check and deduction - deducts immediately
    const hasSufficientCredits = await useTranscriptCredits(userId);
    
    if (!hasSufficientCredits) {
      toast.error(`Insufficient credits. Transcript generation requires ${TRANSCRIPT_CREDIT_COST} credits.`);
      return null;
    }
    
    // Generate transcript using the existing API
    const result = await generateTranscript(
      options.prompt,
      options.scriptModel,
      options.language
    );
    
    // Check if generation was successful
    if (result.transcript && result.transcript.startsWith('Failed to generate transcript') || 
        result.transcript && result.transcript.startsWith('Error:')) {
      toast.error('Failed to generate transcript');
      return {
        transcript: result.transcript,
        guide: '',
        success: false
      };
    }
    
    // Return successful result
    toast.success('Your transcript has been generated!');
    return {
      transcript: result.transcript || '',
      guide: result.guide || '',
      success: true
    };
    
  } catch (error: any) {
    console.error('Error generating transcript:', error);
    toast.error(`Failed to generate transcript: ${error.message || 'Unknown error'}`);
    return null;
  }
}
