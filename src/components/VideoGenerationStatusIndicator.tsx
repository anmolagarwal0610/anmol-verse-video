
import React from 'react';
import { useVideoGenerationContext } from '@/contexts/VideoGenerationContext';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

const VideoGenerationStatusIndicator = () => {
  const { status, progress, cancelGeneration } = useVideoGenerationContext();
  const navigate = useNavigate();
  
  // Only show when there's an active video generation
  if (status !== 'generating' && status !== 'polling') {
    return null;
  }
  
  // Calculate remaining time based on progress (out of 8 minutes)
  const remainingMinutes = Math.max(0, Math.round((100 - progress) / 100 * 8));
  const showCancelButton = progress > 0 && progress < 100;
  
  console.log('StatusIndicator progress:', progress);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1">
            {status === 'generating' || status === 'polling' ? (
              <Loader2 className="h-4 w-4 text-purple-500 animate-spin" />
            ) : status === 'completed' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            
            <span className="text-xs font-medium">
              {Math.round(progress)}%
            </span>
            
            {showCancelButton && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={cancelGeneration}
              >
                Cancel
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2 p-1">
            <p className="text-sm font-medium">Video generation in progress</p>
            <Progress value={progress} className="h-2 w-48" />
            <p className="text-xs text-muted-foreground">
              Est. time remaining: ~{remainingMinutes} {remainingMinutes === 1 ? 'minute' : 'minutes'}
            </p>
            <Button 
              size="sm" 
              className="w-full mt-2 text-xs"
              onClick={() => navigate('/videos/generate')}
            >
              View details
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VideoGenerationStatusIndicator;
