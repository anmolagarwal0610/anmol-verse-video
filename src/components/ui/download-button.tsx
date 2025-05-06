
import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface DownloadButtonProps extends Omit<ButtonProps, 'onClick'> {
  url: string;
  filename?: string;
  fileType?: 'image' | 'video' | 'transcript' | 'audio' | 'archive';
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onClick?: () => void;
  children?: React.ReactNode;
}

const DownloadButton = ({ 
  url, 
  filename, 
  fileType = 'image', 
  variant = 'outline',
  size = 'default',
  className,
  onClick,
  children,
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

  const handleDownload = async (e: React.MouseEvent) => {
    if (isDownloading) return;
    e.preventDefault();
  
    setIsDownloading(true);
    const toastId = toast.loading(`Preparing ${fileType} for download...`, {
      closeButton: true
    });
  
    try {
      console.log('Attempting to fetch file for download:', url);
  
      const response = await fetch(url, { mode: 'cors' });
  
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
  
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || getDefaultFilename();
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
  
      toast.dismiss(toastId);
      toast.success(`${fileType} download started`, {
        closeButton: true
      });
  
      if (onClick) onClick();
    } catch (error) {
      console.warn('Download failed, falling back to opening in new tab:', error);
      toast.dismiss(toastId);
      toast.warning(`Could not download ${fileType} directly due to CORS. Opening in new tab...`, {
        closeButton: true
      });
  
      // Fallback: open in new tab
      window.open(url, '_blank', 'noopener');
  
      toast("If download doesn't start, right-click the new tab and select 'Save As...'", {
        duration: 6000,
        position: 'top-center',
        closeButton: true
      });
    } finally {
      setIsDownloading(false);
    }
  };


  // If children are provided, render them, otherwise use default content
  const buttonContent = children || (
    <>
      <Download className="mr-2 h-4 w-4" />
      {isDownloading ? 'Downloading...' : `Download ${fileType.charAt(0).toUpperCase() + fileType.slice(1)}`}
    </>
  );

  return (
    <Button 
      onClick={handleDownload}
      variant={variant}
      size={size}
      className={className}
      disabled={isDownloading}
      {...props}
    >
      {buttonContent}
    </Button>
  );
};

export default DownloadButton;
