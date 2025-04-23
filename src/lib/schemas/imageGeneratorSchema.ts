
import * as z from 'zod';

// Form validation schema
export const imageGeneratorSchema = z.object({
  prompt: z.string().min(2, { message: 'Please enter a prompt with at least 2 characters' }),
  model: z.enum(['basic', 'advanced', 'pro']),
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
