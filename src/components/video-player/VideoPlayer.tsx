
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import PlayButton from './PlayButton';
import VideoControls from './VideoControls';
import { VideoPlayerProps } from './types';

const VideoPlayer = ({ videoUrl, poster, className }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      if (video) video.currentTime = 0;
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleProgressChange = (newValue: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (newValue[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(newValue[0]);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
      setVolume(video.volume);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (newValue: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = newValue[0];
    setVolume(newValue[0]);
    
    if (newValue[0] === 0) {
      setIsMuted(true);
      video.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      video.muted = false;
    }
  };

  const resetVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);
    setProgress(0);
    
    if (!isPlaying) {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleMouseMove = () => {
    setIsControlsVisible(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setIsControlsVisible(false);
      }
    }, 3000);
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl bg-black aspect-[9/16] max-h-full w-full",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="h-full w-full absolute inset-0" />
        </div>
      )}
      
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        className="h-full w-full object-cover"
        onClick={togglePlay}
        playsInline
      />
      
      {/* Play/Pause overlay button */}
      {!isPlaying && <PlayButton onClick={togglePlay} />}
      
      {/* Controls */}
      <VideoControls 
        isPlaying={isPlaying}
        progress={progress}
        duration={duration}
        currentTime={currentTime}
        volume={volume}
        isMuted={isMuted}
        isControlsVisible={isControlsVisible}
        videoUrl={videoUrl}
        onTogglePlay={togglePlay}
        onProgressChange={handleProgressChange}
        onToggleMute={toggleMute}
        onVolumeChange={handleVolumeChange}
        onReset={resetVideo}
      />
    </motion.div>
  );
};

export default VideoPlayer;
