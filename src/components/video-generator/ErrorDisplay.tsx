
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorDisplayProps {
  message: string;
  onReset: () => void;
}

const ErrorDisplay = ({ message, onReset }: ErrorDisplayProps) => {
  return (
    <Card className="w-full shadow-md border-red-200 dark:border-red-900">
      <CardHeader className="bg-red-50 dark:bg-red-900/20">
        <CardTitle className="text-xl font-semibold text-red-700 dark:text-red-400 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Video Generation Failed
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {message || "An unexpected error occurred during video generation."}
          </AlertDescription>
        </Alert>
        
        <div className="mt-4 p-4 rounded-md bg-slate-50 dark:bg-slate-900">
          <h3 className="font-medium mb-2">Troubleshooting tips:</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            <li>Check your internet connection and try again</li>
            <li>Try simplifying your video topic or shortening the duration</li>
            <li>Wait a few minutes and try again - our servers might be busy</li>
            <li>If the problem persists, contact support</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button 
          onClick={onReset}
          variant="default"
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Try Again
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ErrorDisplay;
