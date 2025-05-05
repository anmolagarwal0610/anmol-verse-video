
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface VideoGenerationConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  topic: string;
  creditCost: number;
  isCheckingCredits?: boolean;
  hasSufficientCredits?: boolean | null;
}

const VideoGenerationConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  topic,
  creditCost,
  isCheckingCredits = false,
  hasSufficientCredits = null
}: VideoGenerationConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Video Generation</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to generate a video with topic: <strong>{topic}</strong>
            <br /><br />
            This action will use <strong>{creditCost} credits</strong> from your account. Are you sure you want to proceed?
            
            {isCheckingCredits && (
              <div className="mt-4 flex items-center justify-center text-amber-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking available credits...
              </div>
            )}
            
            {hasSufficientCredits === false && (
              <div className="mt-4 text-red-500 font-semibold">
                Insufficient credits. Please add more credits to continue.
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isCheckingCredits || hasSufficientCredits === false}
          >
            {isCheckingCredits ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Generate Video'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VideoGenerationConfirmDialog;
