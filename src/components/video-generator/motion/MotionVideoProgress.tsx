import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MotionVideoProgressProps {
  elapsed: number;
}

const MotionVideoProgress = ({ elapsed }: MotionVideoProgressProps) => {
  const progress = Math.min(95, Math.round((elapsed / 40) * 100));

  return (
    <Card className="shadow-lg">
      <CardContent className="py-12 flex flex-col items-center text-center gap-6">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div className="space-y-2">
          <p className="text-lg font-medium">Generating motion...</p>
          <p className="text-sm text-muted-foreground">
            This may take up to 40 seconds. Please keep this page open.
          </p>
        </div>
        <div className="w-full max-w-md space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">{elapsed}s elapsed</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotionVideoProgress;
