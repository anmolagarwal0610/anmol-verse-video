# Together API Upgrade: Dynamic Models + Motion AI Video

## What you'll get

- **Image page**: the model list is fetched live from Together instead of being hard-coded, shown in a clean dropdown with a skeleton while loading, plus a small credit-cost badge next to the Generate button.
- **Video Genie**: a two-card mode switch at the top — "Image Story Video" (your existing voice-backed slideshow, untouched) and a new "Motion AI Video" that turns a prompt or a photo into a real moving clip, with a progress state and an in-page player.

## Phase 1 — Backend

**New function `list-models`**
- `GET https://api.together.xyz/v1/models` with `Authorization: Bearer TOGETHER_API_KEY`.
- Returns only entries whose `type` is `image` or `video`, mapped to `{ id, display_name, type, pricing }`.
- In-memory cache with a 24h TTL, so repeated page loads don't hit Together.
- On failure, returns a small hard-coded fallback list so the UI never shows an empty dropdown.

**Image payload (`src/lib/imageApi.ts`)**
- Image-to-image already sends `reference_images: [image]` and no `image` key — keep as is, and allow a raw Together model id to pass straight through (no `MODEL_MAP` lookup) when the dropdown supplies one, while `basic`/`advanced`/`pro`/`pro-img2img` keys keep working.

**New function `generate-motion-video`**
- `POST` to Together's video generations endpoint with `{ model, prompt, aspect_ratio, image_url? }`; returns the job id to the client.

**New function `motion-video-status`**
- Takes `{ jobId }`, polls Together, returns `{ status, url?, error? }` where `url` is the finished `.mp4`.

Both video functions read `TOGETHER_API_KEY` from secrets; no keys in the browser. The existing Flask-based `generate-video` / `check-video-status` functions stay untouched.

## Phase 2 — Image Generation page

- New `useTogetherModels('image')` hook calling `list-models`.
- `ModelSelect` becomes data-driven: `display_name` as the label, `id` as the value, skeleton row while loading. Sign-in gating for paid models is preserved.
- New `CostBadge` component next to Generate: "⚡ Costs 1 Credit" for free/basic models, "⚡ Costs 5 Credits" for pro-tier models, derived from a cost helper keyed off the model id.

## Phase 3 — Video Genie

- `src/pages/VideoGeneration.tsx` gains a mode state (`story` | `motion`) rendered as two minimalist selectable cards. `story` renders exactly the current form/progress/results flow.
- New `src/components/video-generator/motion/` folder:
  - `MotionVideoForm.tsx` — sub-toggle Text-to-Video / Image-to-Video, prompt textarea, aspect-ratio selector, drag-and-drop uploader (image-to-video), model dropdown from `list-models` filtered to `type === 'video'`, cost badge (8 credits standard / 15 pro).
  - `MotionVideoProgress.tsx` — locked form, progress indicator, "Generating motion... this may take up to 40 seconds."
  - `MotionVideoResult.tsx` — minimalist HTML5 `<video>` player with download link.
  - `useMotionVideo.ts` — submit, then poll `motion-video-status` every 3s with a timeout, using existing credit check/deduct helpers from `creditService`.

All new UI uses existing semantic tokens (`bg-card`, `text-muted-foreground`, `text-cool-lilac` for headings, the standard button gradient) and is responsive at mobile widths.

## Technical notes

- Uploaded images for image-to-video are converted to a data URL / uploaded to the existing storage path and passed as an image reference in the request body.
- Credits are checked before the job starts and deducted once when the job reports completion, tracked by job id to avoid double charging (same pattern as the story flow).
- New functions added to `supabase/config.toml` with `verify_jwt = false` for the model list and JWT required for generation.
- Video model availability on the Together account is unknown until the live list is fetched; if no `type === "video"` models come back, the Motion mode shows a clear "no video models available on your account" message rather than failing silently.
