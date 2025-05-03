
import React from 'react';
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

  const handleDownload = async () => {
    try {
      toast.loading(`Preparing ${fileType} for download...`);
      
      // Use CORS proxy for fetching external resources, especially images
      const response = fileType === 'image' 
        ? await fetchWithCorsProxy(url)
        : await fetch(url);
      
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
    }
  };

  return (
    <Button 
      onClick={handleDownload}
      variant={variant}
      size={size}
      className={className}
      {...props}
    >
      <Download className="mr-2 h-4 w-4" />
      Download {fileType.charAt(0).toUpperCase() + fileType.slice(1)}
    </Button>
  );
};

export default DownloadButton;
