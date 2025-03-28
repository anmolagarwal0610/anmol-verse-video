
export async function validateRequest(requestBody: any, corsHeaders: Record<string, string>) {
  const { imageUrl, userId, prompt } = requestBody;
  
  if (!imageUrl) {
    console.error('No image URL provided');
    return {
      valid: false,
      errorResponse: new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No image URL provided' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    };
  }
  
  if (!userId) {
    console.error('No user ID provided');
    return {
      valid: false,
      errorResponse: new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No user ID provided' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    };
  }
  
  return { valid: true, errorResponse: null };
}
