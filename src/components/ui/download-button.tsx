
import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { fetchWithCorsProxy } from '@/lib/utils/corsProxy';

interface DownloadButtonProps extends Omit<ButtonProps, 'onClick'> {
  url: string;
  filename?: string;
  fileType?: 'image' | 'video' | 'transcript' | 'audio' | 'archive';
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onClick?: () => void;
  imageRef?: React.RefObject<HTMLImageElement>; // Add reference to already loaded image
}

const DownloadButton = ({ 
  url, 
  filename, 
  fileType = 'image', 
  variant = 'outline',
  size = 'default',
  className,
  onClick,
  imageRef,
  ...props 
}: DownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const getFileExtension = () => {
    switch (fileType) {
      case 'image': return '.jpg';
      case 'video': return '.mp4';
      case 'transcript': return '.txt';
      case 'audio': return '.mp3';
      case 'archive': return '.zip';
      default: return '';
    }
  };

  const getDefaultFilename = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const prefix = fileType.charAt(0).toUpperCase() + fileType.slice(1);
    return `${prefix}_${timestamp}${getFileExtension()}`;
  };

  // Function to download from an image element that's already loaded in the DOM
  const downloadFromImageElement = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    
    try {
      if (!imageRef?.current) {
        console.error("Image reference is not available");
        throw new Error("Image reference is not available");
      }

      toast.loading(`Preparing ${fileType} for download...`);
      console.log("🖼️ Downloading from image element:", imageRef.current.src);
      
      // Create a canvas and draw the image to it
      const canvas = document.createElement('canvas');
      canvas.width = imageRef.current.naturalWidth;
      canvas.height = imageRef.current.naturalHeight;
      console.log(`🎨 Created canvas: ${canvas.width}x${canvas.height}`);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("Could not create canvas context");
      }
      
      // Draw the image to the canvas
      ctx.drawImage(imageRef.current, 0, 0);
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Failed to convert canvas to blob"));
          },
          'image/png',
          1.0
        );
      });
      
      console.log(`🔢 Created blob from canvas: ${blob.size} bytes, type: ${blob.type}`);
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || getDefaultFilename();
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      toast.dismiss();
      toast.success(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} downloaded successfully`);
      
      // Call the optional onClick callback if provided
      if (onClick) {
        onClick();
      }
    } catch (error) {
      console.error('Canvas download error:', error);
      toast.dismiss();
      toast.error(`Failed to download ${fileType} via canvas. Trying proxy method...`);
      // Fall back to proxy download if canvas approach fails
      await handleProxyDownload();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleProxyDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    
    try {
      toast.loading(`Preparing ${fileType} for download...`);
      console.log(`🌐 Downloading via proxy: ${url}`);
      
      // Use CORS proxy for fetching external resources, especially images
      const response = await fetchWithCorsProxy(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${fileType}`);
      }
      
      console.log(`✅ Download response status: ${response.status}, type: ${response.headers.get('content-type')}`);
      
      const blob = await response.blob();
      console.log(`🔢 Blob size: ${blob.size}, type: ${blob.type}`);
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || getDefaultFilename();
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      toast.dismiss();
      toast.success(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} downloaded successfully`);
      
      // Call the optional onClick callback if provided
      if (onClick) {
        onClick();
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.dismiss();
      toast.error(`Failed to download ${fileType}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownload = async () => {
    // If we have an image reference and it's an image file, use the canvas approach
    if (imageRef?.current && fileType === 'image') {
      console.log("🖼️ Using canvas download method for image");
      await downloadFromImageElement();
    } else {
      console.log("🌐 Using proxy download method");
      await handleProxyDownload();
    }
  };

  return (
    <Button 
      onClick={handleDownload}
      variant={variant}
      size={size}
      className={className}
      disabled={isDownloading}
      {...props}
    >
      <Download className="mr-2 h-4 w-4" />
      {isDownloading ? `Downloading...` : `Download ${fileType.charAt(0).toUpperCase() + fileType.slice(1)}`}
    </Button>
  );
};

export default DownloadButton;
