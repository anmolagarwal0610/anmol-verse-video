import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FALLBACK_MODELS } from '@/lib/togetherCatalog';

export interface TogetherModel {
  id: string;
  display_name: string;
  type: 'image' | 'video';
  pricing?: unknown;
}

interface ModelResult {
  models: TogetherModel[];
  didFallback: boolean;
}

let cachedModels: TogetherModel[] | null = null;
let inFlight: Promise<ModelResult> | null = null;

const fetchModels = async (force = false): Promise<ModelResult> => {
  if (!force && cachedModels) return { models: cachedModels, didFallback: false };
  if (!force && inFlight) return inFlight;

  inFlight = (async (): Promise<ModelResult> => {
    try {
      const { data, error } = await supabase.functions.invoke('list-models');
      if (error) throw new Error(error.message);
      const models: TogetherModel[] = data?.models ?? [];
      if (models.length === 0) throw new Error('Empty model list');
      // Only cache a genuinely successful, non-fallback response.
      if (!data?.fallback) cachedModels = models;
      return { models, didFallback: Boolean(data?.fallback) };
    } catch {
      // Never leave the pickers empty.
      return { models: FALLBACK_MODELS, didFallback: true };
    }
  })().finally(() => {
    inFlight = null;
  });

  return inFlight;
};

/**
 * Fetches the live Together model catalogue, filtered by modality.
 * Falls back to a curated built-in list when the backend can't be reached.
 */
export const useTogetherModels = (type: 'image' | 'video') => {
  const [models, setModels] = useState<TogetherModel[]>(
    () => (cachedModels ?? []).filter((m) => m.type === type)
  );
  const [isLoading, setIsLoading] = useState(!cachedModels);
  const [didFallback, setDidFallback] = useState(false);

  const load = useCallback(
    (force = false) => {
      setIsLoading(true);
      return fetchModels(force)
        .then(({ models: all, didFallback: fell }) => {
          setModels(all.filter((m) => m.type === type));
          setDidFallback(fell);
        })
        .finally(() => setIsLoading(false));
    },
    [type]
  );

  useEffect(() => {
    let active = true;
    setIsLoading(!cachedModels);

    fetchModels().then(({ models: all, didFallback: fell }) => {
      if (!active) return;
      setModels(all.filter((m) => m.type === type));
      setDidFallback(fell);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [type]);

  const refetch = useCallback(() => load(true), [load]);

  return { models, isLoading, didFallback, refetch, error: null as string | null };
};
