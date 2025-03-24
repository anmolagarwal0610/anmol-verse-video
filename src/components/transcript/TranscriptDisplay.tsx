
import { FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CopyButton } from '@/components/CopyButton';
import { motion } from 'framer-motion';

interface TranscriptDisplayProps {
  transcript: string;
}

export const TranscriptDisplay = ({ transcript }: TranscriptDisplayProps) => {
  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Your Generated Transcript
            <CopyButton text={transcript} variant="ghost" size="sm" className="ml-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{transcript}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
