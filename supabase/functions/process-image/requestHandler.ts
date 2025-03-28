
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';
import { validateRequest } from './validators.ts';
import { downloadImage, uploadImageToStorage, validateBucketExists } from './storageUtils.ts';

// Configuration
const BUCKET_NAME = 'generated.images';

export async function handleRequest(req: Request, corsHeaders: Record<string, string>) {
  console.log(`Processing ${req.method} request to process-image function`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, { headers: corsHeaders });
  }
  
  // Validate request method
  if (req.method !== 'POST') {
    console.error(`Method ${req.method} not allowed`);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Method ${req.method} not allowed` 
      }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  // Log request headers for debugging
  const headersObj: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headersObj[key] = value;
  });
  console.log('Request headers:', JSON.stringify(headersObj, null, 2));
  
  // Check content length
  const contentLength = req.headers.get('content-length');
  console.log(`Content-Length: ${contentLength || 'not provided'}`);
  
  // Get the request body as text first to inspect it
  const bodyText = await req.text();
  console.log(`Request body text (${bodyText.length} bytes): ${bodyText.substring(0, 200)}...`);
  
  if (!bodyText || bodyText.trim() === '') {
    console.error('Empty request body received');
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Empty request body. Please provide image URL, user ID, and prompt.'
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
  
  // Parse request body
  let requestBody;
  try {
    requestBody = JSON.parse(bodyText);
    console.log('Request body parsed successfully:', {
      hasImageUrl: !!requestBody.imageUrl,
      hasUserId: !!requestBody.userId,
      promptLength: requestBody.prompt?.length
    });
  } catch (error) {
    console.error('Error parsing request body:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Invalid request body: ${error.message}`,
        receivedText: bodyText.substring(0, 100) // Include part of what we received for debugging
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
  
  // Validate required fields and process the image
  try {
    const { valid, errorResponse } = await validateRequest(requestBody, corsHeaders);
    if (!valid && errorResponse) {
      return errorResponse;
    }
    
    const { imageUrl, userId, prompt } = requestBody;
    
    console.log(`Processing image for user ${userId}`);
    
    // Create Supabase client
    const supabase = createSupabaseClient();
    
    // Download the image
    console.log(`Downloading image from URL starting with: ${imageUrl.substring(0, 30)}...`);
    const { imageData, contentType } = await downloadImage(imageUrl);
    console.log(`Downloaded ${(imageData.byteLength / 1024).toFixed(2)} KB with content type: ${contentType}`);
    
    // Validate bucket exists before uploading
    console.log(`Verifying that bucket "${BUCKET_NAME}" exists`);
    await validateBucketExists(supabase, BUCKET_NAME);
    
    // Upload to Supabase Storage
    console.log(`Uploading image to storage bucket "${BUCKET_NAME}"`);
    const publicUrl = await uploadImageToStorage(supabase, userId, imageData, contentType);
    console.log(`Upload successful, public URL: ${publicUrl.substring(0, 30)}...`);
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        url: publicUrl,
        message: 'Image processed successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error processing image:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unknown error occurred during image processing' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

export function createSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseServiceRole) {
    console.error('Missing Supabase credentials');
    throw new Error('Missing Supabase credentials. Check environment variables.');
  }
  
  console.log(`Creating Supabase client with URL: ${supabaseUrl.substring(0, 15)}...`);
  return createClient(supabaseUrl, supabaseServiceRole);
}
