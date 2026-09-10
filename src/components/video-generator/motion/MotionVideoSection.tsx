import MotionVideoForm from './MotionVideoForm';
import MotionVideoProgress from './MotionVideoProgress';
import MotionVideoResult from './MotionVideoResult';
import ErrorDisplay from '@/components/video-generator/ErrorDisplay';
import { useMotionVideo } from './useMotionVideo';

interface MotionVideoSectionProps {
  canGenerate: boolean;
  onAuthRequired: () => void;
}

const MotionVideoSection = ({ canGenerate, onAuthRequired }: MotionVideoSectionProps) => {
  const { status, videoUrl, error, elapsed, generate, reset } = useMotionVideo();

  if (status === 'generating') {
    return <MotionVideoProgress elapsed={elapsed} />;
  }

  if (status === 'completed' && videoUrl) {
    return <MotionVideoResult url={videoUrl} onReset={reset} />;
  }

  return (
    <div className="space-y-6">
      {status === 'error' && error && <ErrorDisplay message={error} onReset={reset} />}
      <MotionVideoForm
        onSubmit={(request) => {
          if (!canGenerate) {
            onAuthRequired();
            return;
          }
          generate(request);
        }}
      />
    </div>
  );
};

export default MotionVideoSection;
