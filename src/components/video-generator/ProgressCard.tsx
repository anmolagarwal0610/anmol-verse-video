
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Clock, LoaderCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoGenerationContext } from '@/contexts/VideoGenerationContext';
import { Link } from 'react-router-dom';

interface ProgressCardProps {
  progress: number;
  status: string;
}

const ProgressCard = ({ progress, status }: ProgressCardProps) => {
  const { cancelGeneration } = useVideoGenerationContext();
  
  // Calculate whether to show cancel button (after 6 minutes)
  const minutes = Math.floor(progress / 100 * 30);
  const showCancelButton = minutes >= 6;
  
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Video Generation in Progress
          </CardTitle>
          <LoaderCircle className="h-6 w-6 animate-spin text-purple-500" />
        </div>
        <CardDescription>
          Your video is being created - you can navigate away from this page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Clock className="h-5 w-5" />
          <p className="text-sm">
            Estimated time: approximately {Math.max(0, 30 - minutes)} minutes remaining
          </p>
        </div>
        
        <div className="rounded-md bg-slate-50 dark:bg-slate-900 p-4">
          <p className="text-sm text-center text-muted-foreground">
            Status: <span className="font-medium text-foreground">{status}</span>
          </p>
          <p className="text-xs text-center mt-2 text-muted-foreground">
            Feel free to explore other features while your video is being generated
          </p>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Link to="/images" className="w-full">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Create Images While Waiting
            </Button>
          </Link>
          
          {showCancelButton && (
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={cancelGeneration}
            >
              Cancel Generation
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
