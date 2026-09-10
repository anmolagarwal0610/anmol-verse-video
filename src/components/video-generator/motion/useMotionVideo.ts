import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { checkCredits, useCredit } from '@/lib/creditService';
import { getVideoCreditCost } from '@/lib/creditCosts';

export interface MotionVideoRequest {
  model: string;
  prompt: string;
  aspectRatio: string;
  imageDataUrl?: string;
}

export type MotionStatus = 'idle' | 'generating' | 'completed' | 'error';

const POLL_INTERVAL = 3000;
const MAX_POLL_MS = 5 * 60 * 1000;

export const useMotionVideo = () => {
  const [status, setStatus] = useState<MotionStatus>('idle');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef<number | null>(null);
  const chargedJobs = useRef<Set<string>>(new Set());

  const cleanup = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
    pollRef.current = null;
    tickRef.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const reset = useCallback(() => {
    cleanup();
    setStatus('idle');
    setVideoUrl(null);
    setError(null);
    setElapsed(0);
    startedRef.current = null;
  }, [cleanup]);

  const chargeCredits = useCallback(async (jobId: string, model: string) => {
    if (chargedJobs.current.has(jobId)) return;
    chargedJobs.current.add(jobId);
    const cost = getVideoCreditCost(model);
    const ok = await useCredit(cost);
    if (ok) toast.success(`${cost} credits have been deducted for your video`);
  }, []);

  const generate = useCallback(async (request: MotionVideoRequest) => {
    const cost = getVideoCreditCost(request.model);

    const available = await checkCredits(true);
    if (available < cost) {
      toast.error(`You need ${cost} credits for this video. You have ${available}.`);
      return;
    }

    cleanup();
    setStatus('generating');
    setError(null);
    setVideoUrl(null);
    setElapsed(0);
    startedRef.current = Date.now();

    tickRef.current = setInterval(() => {
      if (startedRef.current) {
        setElapsed(Math.floor((Date.now() - startedRef.current) / 1000));
      }
    }, 1000);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-motion-video', {
        body: {
          model: request.model,
          prompt: request.prompt,
          aspect_ratio: request.aspectRatio,
          image_url: request.imageDataUrl,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      const jobId: string | undefined = data?.jobId;
      if (!jobId) throw new Error('No job was created. Please try again.');

      pollRef.current = setInterval(async () => {
        if (startedRef.current && Date.now() - startedRef.current > MAX_POLL_MS) {
          cleanup();
          setStatus('error');
          setError('Generation timed out. Please try again.');
          return;
        }

        try {
          const { data: statusData, error: statusError } = await supabase.functions.invoke(
            'motion-video-status',
            { body: { jobId } }
          );

          if (statusError) return; // transient; keep polling

          if (statusData?.status === 'completed' && statusData?.url) {
            cleanup();
            setVideoUrl(statusData.url);
            setStatus('completed');
            await chargeCredits(jobId, request.model);
            toast.success('Your motion video is ready!');
          } else if (statusData?.status === 'error') {
            cleanup();
            setStatus('error');
            setError(statusData.error || 'Video generation failed');
          }
        } catch (pollError) {
          console.error('[MOTION VIDEO] Poll error:', pollError);
        }
      }, POLL_INTERVAL);
    } catch (err) {
      cleanup();
      const message = err instanceof Error ? err.message : 'Unknown error';
      setStatus('error');
      setError(message);
      toast.error(`Failed to start video generation: ${message}`);
    }
  }, [chargeCredits, cleanup]);

  return { status, videoUrl, error, elapsed, generate, reset };
};
