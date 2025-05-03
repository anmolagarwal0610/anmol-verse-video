
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
}

const DownloadButton = ({ 
  url, 
  filename, 
  fileType = 'image', 
  variant = 'outline',
  size = 'default',
  className,
  onClick,
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

  const showPersistentMessage = () => {
    // Show a persistent toast that doesn't auto-dismiss
    toast("If automatic download doesn't work, you can right-click on the image and select 'Save Image As...'", {
      duration: Infinity, // Keep it visible until user dismisses
      position: 'top-center',
      action: {
        label: "Got it",
        onClick: () => toast.dismiss()
      }
    });
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    const toastId = toast.loading(`Preparing ${fileType} for download...`);
    
    try {
      console.log('Starting download for URL:', url);
      
      // Always prioritize the working proxy first (api.allorigins.win)
      const response = await fetchWithCorsProxy(url, {}, 2); // Start with index 2 (third proxy in the array)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${fileType}`);
      }
      
      console.log(`Download response status: ${response.status}, type: ${response.headers.get('content-type')}`);
      
      const blob = await response.blob();
      console.log(`Blob size: ${blob.size}, type: ${blob.type}`);
      
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
      toast.dismiss(toastId);
      toast.success(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} download started`);
      
      // Show the persistent fallback message
      showPersistentMessage();
      
      // Call the optional onClick callback if provided
      if (onClick) {
        onClick();
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.dismiss(toastId);
      toast.error(`We couldn't automatically download your ${fileType}`);
      
      // Always show the manual download instructions on error
      showPersistentMessage();
    } finally {
      setIsDownloading(false);
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
      {isDownloading ? 'Downloading...' : `Download ${fileType.charAt(0).toUpperCase() + fileType.slice(1)}`}
    </Button>
  );
};

export default DownloadButton;
