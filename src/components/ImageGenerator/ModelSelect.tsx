
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { MODEL_DESCRIPTIONS } from '@/lib/imageApi';
import { FormValues } from '@/hooks/use-image-generator';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useTogetherModels } from '@/hooks/use-together-models';
import { getImageCreditCost } from '@/lib/creditCosts';

interface ModelSelectProps {
  form: UseFormReturn<FormValues>;
}

const ModelSelect = ({
  form
}: ModelSelectProps) => {
  const { user } = useAuth();
  const { models, isLoading } = useTogetherModels('image');

  return (
    <FormField 
      control={form.control} 
      name="model" 
      render={({field}) => (
        <FormItem>
          <FormLabel>Image Model</FormLabel>
          <FormControl>
            {isLoading ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent position="popper" className={cn("w-full bg-background border shadow-lg max-h-80")}>
                <SelectGroup>
                  <SelectLabel className="text-xs uppercase tracking-wide text-muted-foreground">Recommended</SelectLabel>
                  <SelectItem value="basic">
                    <div className="flex flex-col">
                      <span className="font-medium">Basic</span>
                      <span className="text-xs text-muted-foreground">{MODEL_DESCRIPTIONS.basic}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="advanced" disabled={!user}>
                    <div className="flex flex-col">
                      <span className="font-medium">Advanced {!user && "(Sign-in required)"}</span>
                      <span className="text-xs text-muted-foreground">{MODEL_DESCRIPTIONS.advanced}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pro" disabled={!user}>
                    <div className="flex flex-col">
                      <span className="font-medium">Pro {!user && "(Sign-in required)"}</span>
                      <span className="text-xs text-muted-foreground">{MODEL_DESCRIPTIONS.pro}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pro-img2img" disabled={!user}>
                    <div className="flex flex-col">
                      <span className="font-medium">Pro: image to image {!user && "(Sign-in required)"}</span>
                      <span className="text-xs text-muted-foreground">{MODEL_DESCRIPTIONS["pro-img2img"]}</span>
                    </div>
                  </SelectItem>
                </SelectGroup>

                {models.length > 0 && (
                  <SelectGroup>
                    <SelectLabel className="text-xs uppercase tracking-wide text-muted-foreground">All available models</SelectLabel>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id} disabled={!user}>
                        <div className="flex flex-col">
                          <span className="font-medium">{model.display_name} {!user && "(Sign-in required)"}</span>
                          <span className="text-xs text-muted-foreground">
                            {getImageCreditCost(model.id)} credit{getImageCreditCost(model.id) === 1 ? '' : 's'} per image
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
            )}
          </FormControl>
        </FormItem>
      )} 
    />
  );
};

export default ModelSelect;
