
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import VideoPlayer from '@/components/video-player';
import { VideoData } from '@/components/video-card/types';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoData | null;
}

const VideoPlayerModal = ({ isOpen, onClose, video }: VideoPlayerModalProps) => {
  if (!video) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl p-0 bg-transparent border-none shadow-none">
        <div className="w-full flex items-center justify-center">
          <div className="w-full max-w-md">
            <VideoPlayer 
              videoUrl={video.url} 
              poster={video.thumbnail} 
              className="w-full rounded-xl overflow-hidden shadow-2xl"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
