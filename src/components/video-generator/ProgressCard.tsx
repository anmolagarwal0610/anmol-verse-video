
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, LoaderCircle } from 'lucide-react';

interface ProgressCardProps {
  progress: number;
  status: string;
}

const ProgressCard = ({ progress, status }: ProgressCardProps) => {
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
          Please wait while we create your video
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
            Estimated time: approximately 4 minutes
          </p>
        </div>
        
        <div className="rounded-md bg-slate-50 dark:bg-slate-900 p-4">
          <p className="text-sm text-center text-muted-foreground">
            Status: <span className="font-medium text-foreground">{status}</span>
          </p>
          <p className="text-xs text-center mt-2 text-muted-foreground">
            This process can take several minutes. Please keep this page open.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
