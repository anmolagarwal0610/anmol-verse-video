
export const PIXEL_OPTIONS = {
  "1080p": 1080,
  "1792p": 1792,
  "custom": "custom"
} as const;

export type PixelOptionKey = keyof typeof PIXEL_OPTIONS;

export const MIN_PIXEL_VALUE = 80;
export const MAX_PIXEL_VALUE = 1792;

// Credit cost per 1M pixels
export const CREDIT_COST_PER_MODEL = {
  basic: 0, // Free
  advanced: 10, // 10 credits per 1M pixels
  pro: 70 // 70 credits per 1M pixels
};

// Calculate credits based on pixels and model
export const calculateCreditCost = (
  width: number, 
  height: number,
  model: string
): number => {
  if (model === 'basic') return 0;
  
  const totalPixels = width * height;
  const pixelsInMillions = totalPixels / 1000000;
  
  // Round to nearest million pixels, minimum of 1M
  const roundedPixelsInMillions = Math.max(1, Math.round(pixelsInMillions));
  
  const costPerMillion = CREDIT_COST_PER_MODEL[model as keyof typeof CREDIT_COST_PER_MODEL] || 0;
  return roundedPixelsInMillions * costPerMillion;
};
