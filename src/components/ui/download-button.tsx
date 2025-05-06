
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

  const handleDownload = (e: React.MouseEvent) => {
    if (isDownloading) return;
    e.preventDefault();
  
    setIsDownloading(true);
    const toastId = toast.loading(`Preparing ${fileType} for download...`, {
      closeButton: true,
    });
  
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || getDefaultFilename();
      link.target = '_blank'; // ✅ Opens in new tab if download fails
      link.rel = 'noopener noreferrer';
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      toast.dismiss(toastId);
      toast.success(`${fileType} download started`, {
        closeButton: true,
      });
  
      if (onClick) onClick();
    } catch (error) {
      toast.dismiss(toastId);
      toast.warning(`Could not trigger download. Opening in new tab...`, {
        closeButton: true,
      });
  
      // ✅ Explicitly open in new tab to prevent current tab navigation
      window.open(url, '_blank', 'noopener');
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
