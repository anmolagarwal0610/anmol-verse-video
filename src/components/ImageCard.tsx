
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ImageCardProps {
  image: {
    id: string;
    image_url: string;
    prompt: string;
    created_at: string;
    expires_at: string;
    model: string;
  };
}

const ImageCard = ({ image }: ImageCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDownload = () => {
    window.open(image.image_url, '_blank');
    toast.success('Image opened in new tab');
  };
  
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        setIsDeleting(true);
        const { error } = await supabase
          .from('generated_images')
          .delete()
          .eq('id', image.id);
          
        if (error) throw error;
        toast.success('Image deleted successfully');
        
        // Refresh the page to update the gallery
        window.location.reload();
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('Failed to delete image');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const timeAgo = formatDistanceToNow(new Date(image.created_at), { addSuffix: true });
  const expiresIn = formatDistanceToNow(new Date(image.expires_at), { addSuffix: true });
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img 
            src={image.image_url} 
            alt={image.prompt} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 right-3 flex justify-between">
              <Button 
                size="sm" 
                variant="secondary" 
                className="w-full mr-2 bg-white/90 hover:bg-white text-gray-900"
                onClick={handleDownload}
              >
                <Download size={16} className="mr-1" /> Open
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                className="shrink-0"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </div>
        <div className="p-3 text-sm space-y-1 flex-1 flex flex-col">
          <p className="line-clamp-2 text-muted-foreground flex-1">{image.prompt}</p>
          <div className="space-y-0.5 text-xs text-muted-foreground pt-2">
            <p>Created: {timeAgo}</p>
            <p>Expires: {expiresIn}</p>
            <p>Model: {image.model}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ImageCard;
