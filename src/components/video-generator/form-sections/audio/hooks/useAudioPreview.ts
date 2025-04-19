
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export const useAudioPreview = () => {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    console.log("Audio preview hook mounted or updated");
    return () => {
      console.log("Audio preview hook will unmount");
      if (audioRef.current) {
        console.log("Cleaning up audio on unmount");
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playVoicePreview = (voiceId: string, previewUrl: string, event: React.MouseEvent) => {
    console.log("🔊 Voice preview button clicked for voice ID:", voiceId);
    console.log("Event type:", event.type);
    console.log("Event target:", event.target);
    console.log("Event current target:", event.currentTarget);
    
    // Make sure to prevent event bubbling
    event.preventDefault();
    event.stopPropagation();
    
    if (audioRef.current) {
      console.log("Stopping currently playing audio");
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if (playingVoice === voiceId) {
      console.log("Stopping current voice as it was already playing");
      setPlayingVoice(null);
      return;
    }
    
    if (previewUrl) {
      console.log("Creating new Audio object with URL:", previewUrl);
      
      try {
        const audio = new Audio(previewUrl);
        audioRef.current = audio;
        
        audio.addEventListener('loadstart', () => console.log("Audio loading started"));
        audio.addEventListener('canplaythrough', () => console.log("Audio can play through"));
        audio.addEventListener('error', (e) => {
          console.error("Audio error event:", e);
          const error = audio.error;
          if (error) {
            console.error("Audio error code:", error.code, "message:", error.message);
          }
          setPlayingVoice(null);
          toast.error(`Failed to play voice preview: ${error?.message || 'Unknown error'}`);
        });
        
        // Set playing voice state immediately to show UI feedback
        setPlayingVoice(voiceId);
        
        // Play the audio after a short delay to ensure UI updates first
        setTimeout(() => {
          console.log("Delayed audio play attempt");
          
          if (audioRef.current) {
            audioRef.current.play().then(() => {
              console.log("✅ Audio playback started successfully");
            }).catch(err => {
              console.error("❌ Error playing voice preview:", err);
              toast.error(`Failed to play voice preview: ${err.message}`);
              setPlayingVoice(null);
            });
          }
        }, 50);
        
        audio.onended = () => {
          console.log("Audio playback ended");
          setPlayingVoice(null);
          audioRef.current = null;
        };
      } catch (err) {
        console.error("❌ Error creating audio object:", err);
        toast.error(`Failed to create audio: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  return {
    playingVoice,
    playVoicePreview
  };
};
