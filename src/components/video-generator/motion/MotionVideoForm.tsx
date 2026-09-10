import { useEffect, useMemo, useRef, useState } from 'react';
import { Film, ImagePlus, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import CostBadge from '@/components/shared/CostBadge';
import { useTogetherModels } from '@/hooks/use-together-models';
import { getVideoCreditCost } from '@/lib/creditCosts';
import type { MotionVideoRequest } from './useMotionVideo';

interface MotionVideoFormProps {
  onSubmit: (request: MotionVideoRequest) => void;
  disabled?: boolean;
}

const ASPECT_RATIOS = ['16:9', '9:16', '1:1'];

const MotionVideoForm = ({ onSubmit, disabled }: MotionVideoFormProps) => {
  const { models, isLoading } = useTogetherModels('video');
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [model, setModel] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!model && models.length > 0) setModel(models[0].id);
  }, [models, model]);

  const creditCost = useMemo(() => getVideoCreditCost(model), [model]);

  const readFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Please choose an image under 8MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model) {
      toast.error('Please choose a video model');
      return;
    }
    if (!prompt.trim()) {
      toast.error('Please describe the video you want');
      return;
    }
    if (mode === 'image' && !imageDataUrl) {
      toast.error('Please upload an image to animate');
      return;
    }
    onSubmit({
      model,
      prompt: prompt.trim(),
      aspectRatio,
      imageDataUrl: mode === 'image' ? imageDataUrl ?? undefined : undefined,
    });
  };

  if (!isLoading && models.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardContent className="py-12 text-center space-y-2">
          <p className="font-medium">No video models available on your account</p>
          <p className="text-sm text-muted-foreground">
            Motion AI Video needs a video model enabled on your Together account. Image Story Video still works.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sub-mode toggle */}
          <div className="inline-flex w-full sm:w-auto rounded-lg border border-border bg-muted/30 p-1">
            {([
              { key: 'text' as const, label: 'Text-to-Video', icon: Sparkles },
              { key: 'image' as const, label: 'Image-to-Video', icon: ImagePlus },
            ]).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={cn(
                  'flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                  mode === key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {mode === 'image' && (
            <div className="space-y-2">
              <Label>Source image</Label>
              {imageDataUrl ? (
                <div className="relative rounded-lg border border-border overflow-hidden">
                  <img src={imageDataUrl} alt="Selected source frame" className="w-full max-h-72 object-contain bg-muted/30" />
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => setImageDataUrl(null)}
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) readFile(file);
                  }}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-12 text-center cursor-pointer transition-colors',
                    isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  )}
                >
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Drag and drop an image, or click to browse</p>
                  <p className="text-xs text-muted-foreground">PNG or JPG, up to 8MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) readFile(file);
                }}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="motion-prompt">
              {mode === 'image' ? 'Motion description' : 'Video prompt'}
            </Label>
            <Textarea
              id="motion-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                mode === 'image'
                  ? 'Describe how the image should move, e.g. slow camera push in, hair drifting in the wind'
                  : 'Describe the scene, camera movement, lighting and mood'
              }
              className="min-h-[110px] resize-none"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Video model</Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded-md" />
              ) : (
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a video model" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-background border shadow-lg max-h-72">
                    {models.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{m.display_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {getVideoCreditCost(m.id)} credits per video
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {mode === 'text' && (
              <div className="space-y-2">
                <Label>Aspect ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-background border shadow-lg">
                    {ASPECT_RATIOS.map((ratio) => (
                      <SelectItem key={ratio} value={ratio}>{ratio}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
            <Button type="submit" size="lg" className="w-full sm:flex-1" disabled={disabled}>
              <Film className="mr-2 h-4 w-4" />
              Generate motion video
            </Button>
            <CostBadge credits={creditCost} className="self-start sm:self-auto" />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MotionVideoForm;
