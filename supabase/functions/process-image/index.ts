
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';
import { handleRequest } from './requestHandler.ts';

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Main handler
Deno.serve(async (req) => {
  try {
    return await handleRequest(req, corsHeaders);
  } catch (error) {
    console.error('Unhandled error in process-image function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Unhandled server error: ${error.message || 'Unknown error'}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
