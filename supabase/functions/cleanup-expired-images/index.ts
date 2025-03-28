
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';

// Create Supabase client
const createSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error('Missing Supabase credentials');
  }
  
  // Use service role key for admin privileges
  return createClient(supabaseUrl, supabaseServiceRole);
};

// Check if storage bucket exists, create if it doesn't
async function ensureStorageBucket(supabase) {
  const bucketName = 'generated-images';
  
  // Check if bucket exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error checking storage buckets:', listError);
    throw new Error(`Failed to check buckets: ${listError.message}`);
  }
  
  const bucketExists = buckets.some(bucket => bucket.name === bucketName);
  
  if (!bucketExists) {
    console.log(`Creating storage bucket: ${bucketName}`);
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });
    
    if (createError) {
      console.error('Error creating storage bucket:', createError);
      throw new Error(`Failed to create bucket: ${createError.message}`);
    }
  }
  
  return bucketName;
}

// Main function handler for scheduled cleanup
Deno.serve(async (req) => {
  try {
    console.log('Starting cleanup of old generated images');
    
    const supabase = createSupabaseClient();
    const bucketName = await ensureStorageBucket(supabase);
    
    // Get images older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: oldImages, error: queryError } = await supabase
      .from('generated_images')
      .select('id, image_url, user_id')
      .lt('created_at', sevenDaysAgo.toISOString());
    
    if (queryError) {
      throw new Error(`Failed to query old images: ${queryError.message}`);
    }
    
    console.log(`Found ${oldImages?.length || 0} images to clean up`);
    
    if (!oldImages || oldImages.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No old images to clean up',
        deleted: 0
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Process each image
    let deletedCount = 0;
    const errors = [];
    
    for (const image of oldImages) {
      try {
        // Extract the file path from the URL
        // Format: https://...storage.googleapis.com/storage/v1/object/public/bucket-name/path/to/file
        if (image.image_url && image.image_url.includes('/storage/v1/object/public/')) {
          const urlPath = new URL(image.image_url).pathname;
          const pathMatch = urlPath.match(/\/storage\/v1\/object\/public\/[^\/]+\/(.+)$/);
          
          if (pathMatch && pathMatch[1]) {
            const filePath = pathMatch[1];
            
            console.log(`Deleting file: ${filePath}`);
            
            // Delete from storage
            const { error: deleteError } = await supabase
              .storage
              .from(bucketName)
              .remove([filePath]);
            
            if (deleteError) {
              console.error(`Error deleting file ${filePath}:`, deleteError);
              errors.push(`Failed to delete file ${filePath}: ${deleteError.message}`);
            } else {
              deletedCount++;
            }
          }
        }
        
        // Delete the database record
        const { error: dbDeleteError } = await supabase
          .from('generated_images')
          .delete()
          .eq('id', image.id);
        
        if (dbDeleteError) {
          console.error(`Error deleting record ${image.id}:`, dbDeleteError);
          errors.push(`Failed to delete record ${image.id}: ${dbDeleteError.message}`);
        }
        
      } catch (err) {
        console.error(`Error processing image ${image.id}:`, err);
        errors.push(`Error processing image ${image.id}: ${err.message}`);
      }
    }
    
    console.log(`Cleanup complete. Deleted ${deletedCount} images with ${errors.length} errors`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Cleanup completed',
      deleted: deletedCount,
      errors: errors.length > 0 ? errors : undefined
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error in cleanup function:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'An unknown error occurred' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
