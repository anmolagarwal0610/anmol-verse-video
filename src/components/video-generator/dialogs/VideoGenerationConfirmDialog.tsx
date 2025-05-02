
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
}

const VideoGenerationConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  topic,
  creditCost,
  isCheckingCredits = false
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
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isCheckingCredits}>
            {isCheckingCredits ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking Credits...
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
