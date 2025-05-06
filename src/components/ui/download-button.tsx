
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
  
    toast(`Preparing ${fileType} for download...`, {
      closeButton: true,
      duration: 4000,
    });
  
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || getDefaultFilename();
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      toast.success(`${fileType} download started`, {
        closeButton: true,
        duration: 4000,
      });
  
      if (onClick) onClick();
    } catch (error) {
      toast.warning(`Could not download ${fileType}. Opening in new tab...`, {
        closeButton: true,
        duration: 4000,
      });
  
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
