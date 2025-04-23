
import { useState, useRef } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '@/hooks/use-image-generator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploaderProps {
  form: UseFormReturn<FormValues>;
}

const ImageUploader = ({ form }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const model = form.watch('model');
  const isProModel = model === 'pro';
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error('File must be an image');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `reference-images/${fileName}`;
      const bucketName = 'image-references';
      
      console.log('🔍 [ImageUploader] Attempting upload to bucket:', bucketName);
      console.log('🔍 [ImageUploader] File path:', filePath);
      console.log('🔍 [ImageUploader] File size:', file.size, 'bytes');
      console.log('🔍 [ImageUploader] File type:', file.type);
      
      // Skip bucket creation attempt - assume bucket exists from SQL migration
      console.log('🔍 [ImageUploader] Proceeding with upload to existing bucket');
      
      // Upload directly to Supabase Storage
      console.log('🔍 [ImageUploader] Attempting file upload...');
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);
      
      if (error) {
        console.error('🔍 [ImageUploader] Upload error:', error);
        
        // If the error message suggests bucket doesn't exist, show a specific error
        if (error.message && error.message.includes('bucket') && error.message.includes('exist')) {
          toast.error(`Storage bucket '${bucketName}' not found. Please contact support.`);
        } else {
          toast.error(`Upload failed: ${error.message}`);
        }
        throw error;
      }
      
      console.log('🔍 [ImageUploader] Upload successful:', data);
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      console.log('🔍 [ImageUploader] Public URL:', publicUrlData.publicUrl);
      
      // Set the reference image URL in form
      form.setValue('referenceImageUrl', publicUrlData.publicUrl);
      toast.success('Image uploaded successfully');
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      // Error already displayed in toast above
    } finally {
      setIsUploading(false);
    }
  };
  
  const clearReferenceImage = () => {
    form.setValue('referenceImageUrl', '');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  const referenceImageUrl = form.watch('referenceImageUrl');
  
  return (
    <FormField
      control={form.control}
      name="referenceImageUrl"
      render={({ field }) => (
        <FormItem className={isProModel ? "" : "opacity-50"}>
          <FormLabel>Reference Image {isProModel ? "(Optional)" : ""}</FormLabel>
          <div className="space-y-3">
            {referenceImageUrl ? (
              <div className="relative w-full max-w-[300px] h-auto">
                <img 
                  src={referenceImageUrl} 
                  alt="Reference" 
                  className="rounded-md border border-gray-200 w-full h-auto" 
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm" 
                  className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full"
                  onClick={clearReferenceImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <FormControl>
                  <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    disabled={isUploading || !isProModel}
                    className="sr-only"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                  disabled={isUploading || !isProModel}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? 'Uploading...' : 'Upload Reference Image'}
                </Button>
              </div>
            )}
            <FormDescription>
              Upload a reference image to guide the generation.
              {!isProModel && <span className="text-yellow-500 block">(Only available with Pro model)</span>}
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default ImageUploader;
