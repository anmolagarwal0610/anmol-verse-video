import { Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MotionVideoResultProps {
  url: string;
  onReset: () => void;
}

const MotionVideoResult = ({ url, onReset }: MotionVideoResultProps) => (
  <Card className="shadow-lg overflow-hidden">
    <CardContent className="p-6 space-y-6">
      <video
        src={url}
        controls
        playsInline
        className="w-full rounded-lg bg-black aspect-video"
      />
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild variant="default" className="sm:flex-1">
          <a href={url} download target="_blank" rel="noreferrer">
            <Download className="mr-2 h-4 w-4" />
            Download video
          </a>
        </Button>
        <Button variant="outline" onClick={onReset} className="sm:flex-1">
          <RotateCcw className="mr-2 h-4 w-4" />
          Create another
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default MotionVideoResult;
