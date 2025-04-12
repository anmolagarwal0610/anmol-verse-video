
import { useState, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface ImageDeleteButtonProps {
  imageId: string;
  onDelete?: () => void;
  variant?: 'overlay' | 'standalone';
}

const ImageDeleteButton = ({ 
  imageId, 
  onDelete,
  variant = 'standalone' 
}: ImageDeleteButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  const handleDelete = useCallback(async () => {
    if (!user) {
      toast.error("You need to be signed in to delete images");
      return;
    }

    setIsDeleting(true);
    
    try {
      // Delete the image from Supabase
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .match({ id: imageId, user_id: user.id });
      
      if (error) {
        throw error;
      }
      
      // Call the onDelete callback to update the UI
      if (onDelete) {
        onDelete();
      }
      
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
    }
  }, [imageId, user, onDelete]);
  
  if (variant === 'overlay') {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 hover:bg-black/70 text-white rounded-full"
          onClick={() => setIsDialogOpen(true)}
          disabled={isDeleting}
        >
          <Trash2 className={`h-4 w-4 ${isDeleting ? 'animate-pulse' : ''}`} />
        </Button>
        
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Image</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the image.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 flex items-center gap-1"
        onClick={() => setIsDialogOpen(true)}
        disabled={isDeleting}
      >
        <Trash2 className={`h-3.5 w-3.5 ${isDeleting ? 'animate-pulse' : ''}`} />
        <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
      </Button>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ImageDeleteButton;
