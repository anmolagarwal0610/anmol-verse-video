
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageCard from '@/components/ImageCard';
import EmptyState from '@/components/EmptyState';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface GeneratedImage {
  id: string;
  image_url: string;
  prompt: string;
  created_at: string;
  expires_at: string;
  model: string;
  preferences?: string[] | null;
  user_id?: string | null;
  width: number;
  height: number;
}

const DEFAULT_IMAGES: GeneratedImage[] = [
  {
    id: 'default-1',
    image_url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=2000',
    prompt: 'Starry night with cosmic energy',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    model: 'advanced',
    preferences: ['surreal', 'hyperrealistic'],
    width: 1920,
    height: 1080
  },
  {
    id: 'default-2',
    image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000',
    prompt: 'Mountain summit with fog rolling in',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    model: 'basic',
    preferences: ['8k', 'minimalistic'],
    width: 1920,
    height: 1080
  },
  {
    id: 'default-3',
    image_url: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?q=80&w=2000',
    prompt: 'Desert sand dunes with intricate patterns',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    model: 'advanced',
    preferences: ['minimalistic', 'vintage'],
    width: 1920,
    height: 1080
  },
  {
    id: 'default-4',
    image_url: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=2000',
    prompt: 'Abstract wave formations in cream tones',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    model: 'basic',
    preferences: ['minimalistic', 'hyperrealistic'],
    width: 1080,
    height: 1920
  },
  {
    id: 'default-5',
    image_url: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?q=80&w=2000',
    prompt: 'Architectural composition with flowing lines',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    model: 'advanced',
    preferences: ['minimalistic', '8k'],
    width: 1920,
    height: 1080
  }
];

// Helper function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const ImagesTab = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoadingImages(true);
      
      if (!user) {
        setImages(DEFAULT_IMAGES);
        setIsLoadingImages(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('generated_images')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setImages(data || []);
      } catch (error) {
        console.error('Error fetching images:', error);
        toast.error('Failed to load your images');
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchImages();
  }, [user]);

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copied to clipboard');
  };

  if (isLoadingImages) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <EmptyState
        title={user ? "No images yet" : "Sign in to create images"}
        description={user ? "Generate some images to see them here" : "Create an account to generate and save your own images"}
        action={
          <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            <Link to={user ? "/images" : "/auth"}>{user ? "Create Image" : "Sign In"}</Link>
          </Button>
        }
        className="py-24"
      />
    );
  }

  return (
    <>
      {user && (
        <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-lg text-sm text-indigo-800 dark:text-indigo-300">
          <p>Images are automatically deleted after 7 days. Download any images you want to keep.</p>
        </div>
      )}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {images.map((image, index) => (
          <div key={image.id} className="relative group">
            <ImageCard image={image} index={index} />
            
            {/* Prompt display with copy button */}
            <div className="mt-2 flex items-start">
              <p className="text-xs text-muted-foreground flex-1">
                {truncateText(image.prompt, 40)}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 ml-1"
                      onClick={() => handleCopyPrompt(image.prompt)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy full prompt</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ))}
      </motion.div>
    </>
  );
};

export default ImagesTab;
