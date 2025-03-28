
export async function downloadImage(imageUrl: string) {
  console.log(`Starting download from: ${imageUrl.substring(0, 30)}...`);
  
  try {
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type') || 'image/png';
    const imageData = await response.arrayBuffer();
    
    console.log(`Downloaded ${(imageData.byteLength / 1024).toFixed(2)} KB with content type: ${contentType}`);
    
    return { imageData, contentType };
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error(`Failed to download image: ${error.message}`);
  }
}

export async function validateBucketExists(supabase: any, bucketName: string) {
  try {
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      throw new Error(`Error listing buckets: ${bucketsError.message}`);
    }
    
    console.log(`Found ${buckets?.length || 0} buckets`);
    
    if (buckets) {
      console.log('Available buckets:', buckets.map(b => b.name).join(', '));
    }
    
    const bucketExists = buckets?.some(b => b.name === bucketName);
    if (!bucketExists) {
      console.error(`Bucket "${bucketName}" does not exist`);
      throw new Error(`Storage bucket "${bucketName}" does not exist`);
    }
    
    console.log(`Bucket "${bucketName}" exists`);
  } catch (error) {
    console.error('Error validating bucket:', error);
    throw error;
  }
}

export async function uploadImageToStorage(supabase: any, userId: string, imageData: ArrayBuffer, contentType: string) {
  // Generate a unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const fileExtension = contentType.includes('jpeg') ? 'jpg' : 'png';
  const filename = `${timestamp}-${randomString}.${fileExtension}`;
  const filePath = `${userId}/${filename}`;
  
  console.log(`Uploading to generated.images/${filePath}`);
  
  try {
    // Upload image
    const { data, error } = await supabase
      .storage
      .from('generated.images')
      .upload(filePath, imageData, {
        contentType,
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
    
    console.log('Upload successful:', data);
    
    // Get public URL
    const { data: publicUrlData, error: urlError } = await supabase
      .storage
      .from('generated.images')
      .getPublicUrl(filePath);
    
    if (urlError) {
      console.error('Error getting public URL:', urlError);
      throw new Error(`Failed to get public URL: ${urlError.message}`);
    }
    
    const publicUrl = publicUrlData?.publicUrl;
    
    if (!publicUrl) {
      throw new Error('Failed to get public URL for uploaded image');
    }
    
    console.log(`Generated public URL: ${publicUrl.substring(0, 30)}...`);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImageToStorage:', error);
    throw error;
  }
}
