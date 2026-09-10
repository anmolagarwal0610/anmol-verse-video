# Fix: empty model lists and "no video models" message

## What's actually wrong

The three new backend endpoints added with the Motion AI upgrade were never deployed. Checked live:

- model list -> not found
- start motion video -> not found
- motion video status -> not found
- older endpoints (image, video status) -> live and responding

So the app asks for the model catalogue, gets nothing back, and shows:

- Image page: only the 4 built-in options (Basic / Advanced / Pro / Pro image-to-image), no live list
- Motion AI Video: "No video models available on your account"

The Together account itself has not been ruled in or out yet — that can only be checked once the model list endpoint is live.

## Fix

1. Redeploy the three functions (`list-models`, `generate-motion-video`, `motion-video-status`) by touching them so the platform picks them up, then confirm each responds instead of returning "not found".
2. Once the model list responds, read what Together actually returns for this account and confirm which entries are images and which are videos.
3. Make the app resilient so a backend hiccup never again shows an empty list:
   - When the model list can't be reached, fall back to a small built-in list of known image and video models instead of an empty dropdown.
   - Motion AI Video only shows the "no video models" message when the list loaded successfully and genuinely had no video entries; if the list failed, show a short "couldn't load models, retry" state with a retry button.
4. If Together really returns no video models for this account, keep the existing explanatory message but word it accurately and name the models the app would use.

## Technical notes

- `src/hooks/use-together-models.ts`: on error, resolve to a `FALLBACK_MODELS` constant (image: FLUX 1.1 Pro, FLUX Kontext Pro; video: the video ids confirmed in step 2) and expose a `refetch` plus a distinct `didFallback` flag; don't cache a failed result.
- `src/components/video-generator/motion/MotionVideoForm.tsx`: branch on `error`/`didFallback` versus a genuinely empty successful list.
- `src/components/ImageGenerator/ModelSelect.tsx`: unchanged logic — it already renders the live group when models exist.
- No changes to the story-video flow, credits, or the image generation payload.
