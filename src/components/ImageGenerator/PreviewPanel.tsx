
import { Loader2, ImageIcon } from 'lucide-react';
import ImagePreview from '@/components/ImagePreview';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface PreviewPanelProps {
  isGenerating: boolean;
  imageUrl: string | null;
  outputFormat: 'jpeg' | 'png';
}

const PreviewPanel = ({ isGenerating, imageUrl, outputFormat }: PreviewPanelProps) => {
  const isMobile = useIsMobile();
  
  const handleDownload = () => {
    console.log('✅ Image downloaded or opened successfully');
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50/80 to-purple-50/20 dark:from-indigo-900/30 dark:to-purple-950/20 rounded-lg overflow-hidden min-h-[400px] md:min-h-[500px] backdrop-blur-sm border border-indigo-200/10">
      {isGenerating ? (
        <div className="text-center p-8">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-indigo-500" />
          <p className="mt-4 text-muted-foreground bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent font-medium">
            Generating your image...
          </p>
        </div>
      ) : imageUrl ? (
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <ImagePreview 
            imageUrl={imageUrl} 
            outputFormat={outputFormat} 
            onDownload={handleDownload} 
          />
        </div>
      ) : (
        <div className="text-center p-8">
          <ImageIcon className="mx-auto h-12 w-12 text-indigo-400/70" />
          <p className="mt-4 text-muted-foreground">Your generated image will appear here</p>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;
