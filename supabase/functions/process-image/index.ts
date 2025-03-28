
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';
import { Storage } from 'https://cdn.skypack.dev/@google-cloud/storage@6.9.3?dts';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

// Set up Google Cloud Storage client
const setupGoogleStorage = () => {
  try {
    const credentials = {
      client_email: Deno.env.get('GOOGLE_CLOUD_CLIENT_EMAIL'),
      private_key: Deno.env.get('GOOGLE_CLOUD_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
      project_id: Deno.env.get('GOOGLE_CLOUD_PROJECT_ID'),
    };

    if (!credentials.client_email || !credentials.private_key || !credentials.project_id) {
      throw new Error('Missing Google Cloud credentials');
    }

    return new Storage({
      credentials,
    });
  } catch (error) {
    console.error('Error setting up Google Cloud Storage:', error);
    throw error;
  }
};

// Calculate expiration date (7 days from now)
const getExpirationDate = () => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);
  return expirationDate;
};

// Download image from URL
async function downloadImage(url: string): Promise<Uint8Array> {
  try {
    console.log(`Downloading image from URL: ${url.substring(0, 50)}...`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

// Get content type from URL or response
function getContentType(url: string, defaultType = 'image/png'): string {
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) {
    return 'image/jpeg';
  } else if (url.endsWith('.png')) {
    return 'image/png';
  } else if (url.endsWith('.webp')) {
    return 'image/webp';
  } else if (url.endsWith('.gif')) {
    return 'image/gif';
  }
  return defaultType;
}

// Generate a unique filename
function generateFilename(userId: string, contentType: string): string {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  const random = Math.random().toString(36).substring(2, 8);
  const extension = contentType.split('/')[1];
  
  return `user-${userId}/${timestamp}-${random}.${extension}`;
}

// Upload to Google Cloud Storage
async function uploadToGoogleStorage(
  storage: Storage,
  bucketName: string,
  fileBuffer: Uint8Array,
  filename: string,
  contentType: string
): Promise<string> {
  try {
    console.log(`Uploading to GCS bucket: ${bucketName}, filename: ${filename}`);
    
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);
    
    // Set metadata including content type and expiration
    const metadata = {
      contentType,
      metadata: {
        expires: getExpirationDate().toISOString()
      }
    };
    
    // Upload the file with metadata
    await file.save(fileBuffer, {
      metadata,
      resumable: false,
    });
    
    // Make the file publicly accessible
    await file.makePublic();
    
    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
    console.log(`File uploaded successfully. Public URL: ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading to Google Cloud Storage:', error);
    throw error;
  }
}

// Alternative: Upload to Supabase Storage
async function uploadToSupabaseStorage(
  supabase: any,
  bucketName: string,
  fileBuffer: Uint8Array,
  filename: string,
  contentType: string
): Promise<string> {
  try {
    console.log(`Uploading to Supabase Storage bucket: ${bucketName}, filename: ${filename}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filename, fileBuffer, {
        contentType,
        cacheControl: '3600',
        upsert: true,
      });
    
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filename);
    
    console.log(`File uploaded successfully to Supabase. Public URL: ${urlData.publicUrl}`);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase Storage:', error);
    throw error;
  }
}

// Main function handler
Deno.serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  try {
    const { imageUrl, userId, prompt, useSupabase } = await req.json();
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: imageUrl' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Processing image for user: ${userId}`);
    console.log(`Source image URL: ${imageUrl.substring(0, 50)}...`);
    
    // Download the image
    const imageBuffer = await downloadImage(imageUrl);
    
    // Determine content type
    const contentType = getContentType(imageUrl);
    
    // Generate a unique filename
    const filename = generateFilename(userId, contentType);
    
    let permanentUrl: string;
    
    // Choose storage method based on request parameter
    if (useSupabase) {
      // Use Supabase Storage
      console.log('Using Supabase Storage');
      
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase credentials');
      }
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      // Upload to Supabase Storage
      permanentUrl = await uploadToSupabaseStorage(
        supabase,
        'generated-images',
        imageBuffer,
        filename,
        contentType
      );
    } else {
      // Use Google Cloud Storage (default)
      console.log('Using Google Cloud Storage');
      
      // Initialize Google Cloud Storage
      const storage = setupGoogleStorage();
      
      // Upload to Google Cloud Storage
      const bucketName = `${Deno.env.get('GOOGLE_CLOUD_PROJECT_ID')}-images`;
      permanentUrl = await uploadToGoogleStorage(
        storage,
        bucketName,
        imageBuffer,
        filename,
        contentType
      );
    }
    
    // Return the permanent URL
    return new Response(
      JSON.stringify({ 
        success: true, 
        url: permanentUrl,
        originalUrl: imageUrl,
        contentType,
        filename,
        expirationDate: getExpirationDate().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Error processing image:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while processing the image' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
