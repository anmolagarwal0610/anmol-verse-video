
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';
// @ts-ignore
import { decode as decodeBase64 } from 'https://deno.land/std@0.212.0/encoding/base64.ts';

// Handle CORS preflight requests
function handleCors(req: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request - returning CORS headers');
    return new Response(null, { headers: corsHeaders });
  }
  
  return { corsHeaders };
}

// Create Supabase client
const createSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  console.log('Creating Supabase client with URL present:', !!supabaseUrl);
  console.log('Service role key present:', !!supabaseServiceRole);
  
  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error('Missing Supabase credentials');
  }
  
  // Use service role key for admin privileges
  return createClient(supabaseUrl, supabaseServiceRole);
};

// Main function handler
Deno.serve(async (req) => {
  console.log(`Request received: ${req.method} ${new URL(req.url).pathname}`);
  
  const { corsHeaders } = handleCors(req) as { corsHeaders: Record<string, string> };
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    if (req.method !== 'POST') {
      console.error(`Method ${req.method} not allowed`);
      throw new Error(`Method ${req.method} not allowed`);
    }
    
    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request body parsed successfully');
    } catch (error) {
      console.error('Failed to parse request body:', error);
      throw new Error('Invalid request body');
    }
    
    const { imageUrl, userId, prompt } = requestBody;
    
    if (!imageUrl) {
      console.error('No image URL provided');
      throw new Error('No image URL provided');
    }
    
    if (!userId) {
      console.error('No user ID provided');
      throw new Error('No user ID provided');
    }
    
    console.log(`Processing image for user ${userId}, prompt length: ${prompt?.length || 0} chars`);
    console.log(`Source image URL starts with: ${imageUrl.substring(0, 30)}...`);
    
    // Download the image from the source URL
    console.log('Attempting to download image from source URL...');
    let imageResponse;
    try {
      imageResponse = await fetch(imageUrl);
      
      if (!imageResponse.ok) {
        console.error(`Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`);
        throw new Error(`Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      throw new Error(`Failed to fetch image: ${error.message}`);
    }
    
    // Get image data
    let imageData;
    let contentType;
    try {
      imageData = await imageResponse.arrayBuffer();
      contentType = imageResponse.headers.get('content-type') || 'image/png';
      console.log(`Downloaded image (${(imageData.byteLength / 1024).toFixed(2)} KB) with content type: ${contentType}`);
    } catch (error) {
      console.error('Error processing image data:', error);
      throw new Error(`Failed to process image data: ${error.message}`);
    }
    
    // Create Supabase client
    console.log('Creating Supabase client...');
    let supabase;
    try {
      supabase = createSupabaseClient();
    } catch (error) {
      console.error('Error creating Supabase client:', error);
      throw new Error(`Failed to create Supabase client: ${error.message}`);
    }
    
    // The exact bucket name - make sure it's correct
    const bucketName = 'generated.images';
    console.log(`Using storage bucket: ${bucketName}`);
    
    // Check if bucket exists
    try {
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
      
      console.log('Available buckets:', buckets?.map(b => b.name));
      
      if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
      }
      
      const bucketExists = buckets?.some(b => b.name === bucketName);
      if (!bucketExists) {
        console.error(`Bucket "${bucketName}" does not exist!`);
        throw new Error(`Storage bucket "${bucketName}" does not exist`);
      } else {
        console.log(`Bucket "${bucketName}" exists, proceeding with upload`);
      }
    } catch (error) {
      console.error('Error checking bucket existence:', error);
      throw new Error(`Failed to check bucket existence: ${error.message}`);
    }
    
    // Test bucket permissions
    try {
      console.log(`Testing bucket permissions for ${bucketName}`);
      const { data: testData, error: testError } = await supabase
        .storage
        .from(bucketName)
        .list(userId || 'test');
        
      if (testError) {
        console.error(`Permission check error: ${testError.message}`);
        // Don't throw here, we just want to log the error
      } else {
        console.log(`Permission check successful, found ${testData?.length || 0} existing files`);
      }
    } catch (error) {
      console.error('Error during permission check:', error);
      // Don't throw here, we just want to log the error
    }
    
    // Generate a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const fileExtension = contentType.includes('jpeg') ? 'jpg' : 'png';
    const filename = `${timestamp}-${randomString}.${fileExtension}`;
    const filePath = `${userId}/${filename}`;
    
    console.log(`Uploading to ${bucketName}/${filePath}`);
    
    // Upload the image to Supabase Storage
    let uploadData;
    try {
      console.log(`Starting upload to ${bucketName}/${filePath}`);
      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .upload(filePath, imageData, {
          contentType,
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Error uploading to Supabase Storage:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }
      
      uploadData = data;
      console.log('File uploaded successfully:', uploadData);
    } catch (error) {
      console.error('Exception during upload:', error);
      throw new Error(`Exception during upload: ${error.message}`);
    }
    
    // Get the public URL
    let publicUrl;
    try {
      console.log(`Getting public URL for ${bucketName}/${filePath}`);
      const { data: publicUrlData } = await supabase
        .storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      publicUrl = publicUrlData?.publicUrl;
      
      if (!publicUrl) {
        console.error('Failed to get public URL for uploaded image');
        throw new Error('Failed to get public URL for uploaded image');
      }
      
      console.log(`Successfully retrieved public URL: ${publicUrl}`);
    } catch (error) {
      console.error('Error getting public URL:', error);
      throw new Error(`Failed to get public URL: ${error.message}`);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        url: publicUrl,
        message: 'Image processed successfully'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error('Error in process-image function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
