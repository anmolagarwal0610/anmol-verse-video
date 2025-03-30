
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
import { supabase } from '@/integrations/supabase/client';

interface ImageDeleteButtonProps {
  imageId: string;
  variant?: 'overlay' | 'default';
  onDelete?: () => void;
}

const ImageDeleteButton = ({ imageId, variant = 'default', onDelete }: ImageDeleteButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Delete the image from Supabase
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', imageId);
      
      if (error) {
        throw error;
      }
      
      toast.success('Image deleted successfully');
      
      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };
  
  // Styles for overlay variant
  const overlayStyles = variant === 'overlay' 
    ? 'absolute bottom-3 right-14 z-10 bg-black/60 hover:bg-black/80 text-white border-none opacity-0 group-hover:opacity-100 transition-opacity' 
    : '';

  return (
    <>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className={`${overlayStyles}`}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
        {variant !== 'overlay' && <span>Delete</span>}
      </Button>
      
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
