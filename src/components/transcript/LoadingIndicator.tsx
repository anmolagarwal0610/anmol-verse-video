
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface LoadingIndicatorProps {
  progress: number;
}

export const LoadingIndicator = ({ progress }: LoadingIndicatorProps) => {
  return (
    <motion.div 
      className="mt-8 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <p className="text-sm text-muted-foreground">Generating your transcript. This may take up to 30 seconds...</p>
      <Progress value={progress} className="h-2" />
    </motion.div>
  );
};
