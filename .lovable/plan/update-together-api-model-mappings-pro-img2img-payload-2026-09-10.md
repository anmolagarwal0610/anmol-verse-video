# Update Together API model mappings & pro-img2img payload

File to edit: `src/lib/imageApi.ts` only. No changes to the Deno edge function.

## 1. Update `MODEL_MAP` (lines 33-38)

```ts
const MODEL_MAP = {
  basic: "black-forest-labs/FLUX.2-klein",
  advanced: "black-forest-labs/FLUX.2-klein",
  pro: "black-forest-labs/FLUX.1.1-pro",
  "pro-img2img": "black-forest-labs/FLUX.2-dev"
};
```

`STEPS_MAP` (lines 41-46) stays unchanged — basic/advanced = 4, pro/pro-img2img = 28.

## 2. Update the pro-img2img routing condition (line 63)

The current branch is gated on `selectedModel === "black-forest-labs/FLUX.1-kontext-dev"`. Once the model map changes to `FLUX.2-dev`, that string match would never be true and the image-to-image branch becomes dead code. Switch the gate to the form-side model key so it stays correct regardless of the resolved model string:

```ts
if (params.model === 'pro-img2img') {
```

## 3. Fix the pro-img2img payload (lines 69-79)

Replace the `image` string key with the `reference_images` array the Together API expects. Remove `image` entirely.

```ts
payload = {
  model: selectedModel,
  prompt: params.prompt,
  reference_images: [params.condition_image], // array of strings, per Together API
  steps: steps,
  width: params.width,
  height: params.height,
  guidance_scale: params.guidance,
  output_format: params.output_format,
  n: 1
};
```

The `condition_image`-required guard (lines 64-66) and the negative-prompt / seed additions (lines 82-89) remain. The log label on line 91 can stay as-is or be relabeled to "FLUX image-to-image payload:" — cosmetic only.

## 4. No other changes

- Standard payload branch (lines 92+) untouched.
- Edge function `supabase/functions/generate-image/index.ts` untouched.
- No changes to `STEPS_MAP`, `calculateDimensions`, `ASPECT_RATIOS`, `IMAGE_STYLES`, or `MODEL_DESCRIPTIONS`.

## Verification

After editing, run the project typecheck (`tsgo`) to confirm the file still compiles, then spot-read the edited region to confirm the `reference_images` array and the `params.model === 'pro-img2img'` gate are in place.
