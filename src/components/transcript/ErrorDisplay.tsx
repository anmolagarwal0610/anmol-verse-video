
import { useState } from 'react';
import { AlertTriangle, RefreshCcw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';

interface ErrorDisplayProps {
  error: string;
  debugInfo: string | null;
  onRetry: () => void;
  isGenerating: boolean;
  prompt: string;
}

export const ErrorDisplay = ({ 
  error, 
  debugInfo, 
  onRetry, 
  isGenerating, 
  prompt 
}: ErrorDisplayProps) => {
  const [showAdvancedDebug, setShowAdvancedDebug] = useState(false);

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-destructive flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            API Connection Error
          </CardTitle>
          <CardDescription className="text-destructive/80">
            There was a problem connecting to the transcript generation service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-destructive/90">{error}</p>
          
          <Alert>
            <AlertTitle>Try these troubleshooting steps:</AlertTitle>
            <AlertDescription className="space-y-2 text-sm">
              <p>1. Click the "Try Alternative Method" button</p>
              <p>2. Try a simpler, shorter prompt</p>
              <p>3. The server might be experiencing high traffic - wait a few minutes and try again</p>
            </AlertDescription>
          </Alert>
          
          {showAdvancedDebug && debugInfo && (
            <Alert variant="destructive" className="bg-transparent border-dashed">
              <AlertTitle className="flex items-center">
                Debug Information
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto"
                  onClick={() => navigator.clipboard.writeText(debugInfo)}
                >
                  Copy
                </Button>
              </AlertTitle>
              <AlertDescription>
                <pre className="text-xs overflow-auto p-2 whitespace-pre-wrap">
                  {debugInfo}
                </pre>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap gap-3">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full sm:w-auto" 
              size="lg"
              onClick={onRetry}
              disabled={isGenerating || !prompt.trim()}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Alternative Method
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setShowAdvancedDebug(!showAdvancedDebug)}
              title="Toggle advanced debug info"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
