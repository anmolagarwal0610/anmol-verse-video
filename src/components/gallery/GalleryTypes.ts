
export interface GeneratedImage {
  id: string;
  image_url: string;
  prompt: string;
  created_at: string;
  model: string;
  preferences?: string[] | null;
  user_id?: string | null;
  width: number;
  height: number;
  expiry_time: string;
}

// Helper function to truncate text
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Default images for non-authenticated users - using reliable Unsplash URLs
export const DEFAULT_IMAGES: GeneratedImage[] = [
  {
    id: 'default-1',
    image_url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=2000',
    prompt: 'Starry night with cosmic energy',
    created_at: new Date().toISOString(),
    model: 'advanced',
    preferences: ['surreal', 'hyperrealistic'],
    width: 1920,
    height: 1080,
    expiry_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  },
  {
    id: 'default-2',
    image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000',
    prompt: 'Mountain summit with fog rolling in',
    created_at: new Date().toISOString(),
    model: 'basic',
    preferences: ['8k', 'minimalistic'],
    width: 1920,
    height: 1080,
    expiry_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  },
  {
    id: 'default-3',
    image_url: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?q=80&w=2000',
    prompt: 'Desert sand dunes with intricate patterns',
    created_at: new Date().toISOString(),
    model: 'advanced',
    preferences: ['minimalistic', 'vintage'],
    width: 1920,
    height: 1080,
    expiry_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  },
  {
    id: 'default-4',
    image_url: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=2000',
    prompt: 'Abstract wave formations in cream tones',
    created_at: new Date().toISOString(),
    model: 'basic',
    preferences: ['minimalistic', 'hyperrealistic'],
    width: 1080,
    height: 1920,
    expiry_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  },
  {
    id: 'default-5',
    image_url: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?q=80&w=2000',
    prompt: 'Architectural composition with flowing lines',
    created_at: new Date().toISOString(),
    model: 'advanced',
    preferences: ['minimalistic', '8k'],
    width: 1920,
    height: 1080,
    expiry_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  }
];
