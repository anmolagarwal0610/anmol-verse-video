/**
 * Credit cost helpers shared by the image and motion-video forms.
 */

const PRO_IMAGE_HINTS = ['pro', 'dev', 'kontext', 'ultra'];
const FREE_IMAGE_HINTS = ['free', 'schnell', 'klein', 'lite', 'turbo'];

export const getImageCreditCost = (model: string): number => {
  if (!model) return 1;

  // Legacy tier keys used by the form
  if (model === 'basic') return 1;
  if (model === 'advanced') return 1;
  if (model === 'pro' || model === 'pro-img2img') return 5;

  const id = model.toLowerCase();
  if (FREE_IMAGE_HINTS.some((hint) => id.includes(hint))) return 1;
  if (PRO_IMAGE_HINTS.some((hint) => id.includes(hint))) return 5;
  return 1;
};

export const getVideoCreditCost = (model: string): number => {
  if (!model) return 8;
  const id = model.toLowerCase();
  const isPro = ['pro', 'ultra', 'max'].some((hint) => id.includes(hint));
  return isPro ? 15 : 8;
};
