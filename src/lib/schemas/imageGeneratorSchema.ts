
import * as z from 'zod';
import { PIXEL_OPTIONS, MIN_PIXEL_VALUE, MAX_PIXEL_VALUE } from '@/lib/constants/pixelOptions';

// Form validation schema
export const imageGeneratorSchema = z.object({
  prompt: z.string().min(2, { message: 'Please enter a prompt with at least 2 characters' }),
  model: z.enum(['basic', 'advanced', 'pro']),
  pixelOption: z.enum(Object.keys(PIXEL_OPTIONS) as [string, ...string[]]),
  pixelOptionValue: z.number()
    .min(MIN_PIXEL_VALUE, { message: `Minimum value is ${MIN_PIXEL_VALUE}` })
    .max(MAX_PIXEL_VALUE, { message: `Maximum value is ${MAX_PIXEL_VALUE}` })
    .optional(),
  aspectRatio: z.string(),
  customRatio: z.string().regex(/^\d+:\d+$/, { message: 'Format must be width:height (e.g., 16:9)' }).optional(),
  guidance: z.number().min(1).max(10),
  outputFormat: z.enum(['jpeg', 'png']),
  showSeed: z.boolean().default(false),
  seed: z.number().int().optional(),
  negativePrompt: z.string().optional(),
  imageStyles: z.array(z.string()).default([]),
  referenceImageUrl: z.string().optional().default(''),
});

export type FormValues = z.infer<typeof imageGeneratorSchema>;
