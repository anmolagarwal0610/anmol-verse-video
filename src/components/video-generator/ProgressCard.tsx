
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, LoaderCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoGenerationContext } from '@/contexts/VideoGenerationContext';
import { Link } from 'react-router-dom';
import AnimatedLoadingIndicator from './AnimatedLoadingIndicator';
import WaitingGame from './WaitingGame';

interface ProgressCardProps {
  progress: number;
  status: string;
}

const ProgressCard = ({ progress, status }: ProgressCardProps) => {
  const { cancelGeneration } = useVideoGenerationContext();
  
  console.log('ProgressCard: Rendering with progress:', progress, 'and status:', status);
  
  const minutes = Math.floor(progress / 100 * 8);
  const showCancelButton = minutes >= 8;
  
  return (
    <Card className="w-full shadow-lg border-indigo-200 dark:border-indigo-800">
      <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-indigo-900 dark:text-indigo-100">
            Video Generation in Progress
          </CardTitle>
          <LoaderCircle className="h-6 w-6 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
        <CardDescription className="text-indigo-600/70 dark:text-indigo-300/70">
          Your video is being created - you can navigate away from this page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <AnimatedLoadingIndicator progress={progress} status={status} />
        
        <div className="flex items-center justify-center space-x-2 text-indigo-600/70 dark:text-indigo-300/70">
          <Clock className="h-5 w-5" />
          <p className="text-sm">
            Estimated time: approximately {Math.max(0, 8 - minutes)} minutes remaining
          </p>
        </div>
        
        <div className="rounded-md bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 p-4 shadow-inner">
          <p className="text-sm text-center text-indigo-600 dark:text-indigo-300">
            Status: <span className="font-medium text-indigo-700 dark:text-indigo-200">{status}</span>
          </p>
          <p className="text-xs text-center mt-2 text-indigo-500/70 dark:text-indigo-300/70">
            Catch the dots while you wait!
          </p>
        </div>

        <WaitingGame />
        
        <div className="flex flex-col space-y-2">
          <Link to="/images" className="w-full">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2 border-indigo-200 hover:border-indigo-300 dark:border-indigo-800 dark:hover:border-indigo-700">
              <ExternalLink className="h-4 w-4" />
              Create Images While Waiting
            </Button>
          </Link>
          
          {showCancelButton && (
            <Button 
              variant="destructive" 
              className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700" 
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
