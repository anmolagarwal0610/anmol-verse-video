import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TogetherModel {
  id: string;
  display_name: string;
  type: 'image' | 'video';
  pricing?: unknown;
}

let cachedModels: TogetherModel[] | null = null;
let inFlight: Promise<TogetherModel[]> | null = null;

const fetchModels = async (): Promise<TogetherModel[]> => {
  if (cachedModels) return cachedModels;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const { data, error } = await supabase.functions.invoke('list-models');
    if (error) throw new Error(error.message);
    const models: TogetherModel[] = data?.models ?? [];
    cachedModels = models;
    return models;
  })().finally(() => {
    inFlight = null;
  });

  return inFlight;
};

/**
 * Fetches the live Together model catalogue, filtered by modality.
 */
export const useTogetherModels = (type: 'image' | 'video') => {
  const [models, setModels] = useState<TogetherModel[]>(
    () => (cachedModels ?? []).filter((m) => m.type === type)
  );
  const [isLoading, setIsLoading] = useState(!cachedModels);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(!cachedModels);

    fetchModels()
      .then((all) => {
        if (!active) return;
        setModels(all.filter((m) => m.type === type));
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load models');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [type]);

  return { models, isLoading, error };
};
