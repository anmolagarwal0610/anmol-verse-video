
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import VideoPlayer from '@/components/video-player';
import { VideoData } from '@/components/video-card/types';
import DownloadButton from '@/components/ui/download-button';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoData | null;
}

const VideoPlayerModal = ({ isOpen, onClose, video }: VideoPlayerModalProps) => {
  if (!video) return null;
  
  // Handle escape key for closing the modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="p-0 bg-transparent border-none shadow-none max-w-5xl max-h-[90vh] overflow-hidden"
        onPointerDownOutside={onClose}
        onInteractOutside={onClose}
      >
        <div className="relative w-full flex items-center justify-center">
          <div className="w-full max-w-4xl bg-black/95 rounded-xl overflow-hidden shadow-2xl p-4">
            {/* Close button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 z-50 bg-black/40 text-white hover:bg-black/60 rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="flex flex-col gap-4">
              {/* Video title */}
              <h2 className="text-xl font-semibold text-white px-2">
                {video.title || video.prompt || "Untitled Video"}
              </h2>
              
              {/* Responsive video container */}
              <div className="w-full flex items-center justify-center">
                <div className="w-full aspect-auto max-h-[70vh] flex items-center justify-center">
                  <VideoPlayer 
                    videoUrl={video.url} 
                    poster={video.thumbnail} 
                    className="w-auto h-auto max-w-full max-h-[70vh] rounded-lg overflow-hidden"
                  />
                </div>
              </div>
              
              {/* Download button */}
              <div className="flex justify-end px-2 pt-2">
                <DownloadButton 
                  url={video.url}
                  filename={`${video.title || 'video'}.mp4`}
                  fileType="video"
                  variant="secondary"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
