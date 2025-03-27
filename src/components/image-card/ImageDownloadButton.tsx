
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImageDownloadButtonProps {
  imageUrl: string;
  prompt: string;
  variant?: "overlay" | "normal";
}

const ImageDownloadButton = ({ imageUrl, prompt, variant = "normal" }: ImageDownloadButtonProps) => {
  const handleDownloadImage = async () => {
    try {
      // Remove any timestamp or query parameters to get the original URL
      const cleanImageUrl = imageUrl.split('?')[0];
      console.log('Attempting to download image from:', cleanImageUrl);
      
      const response = await fetch(cleanImageUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      // Create object URL for downloading
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element to trigger download
      const a = document.createElement('a');
      a.href = url;
      // Generate filename based on prompt (or use a default)
      const filename = prompt 
        ? `${prompt.slice(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg` 
        : `image_${new Date().getTime()}.jpg`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Image downloaded successfully');
    } catch (err) {
      console.error('Error downloading image:', err);
      toast.error('Failed to download image');
    }
  };

  if (variant === "overlay") {
    return (
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          variant="secondary"
          size="sm"
          className="backdrop-blur-sm bg-white/20 hover:bg-white/30"
          onClick={handleDownloadImage}
        >
          <Download className="mr-1 h-4 w-4" /> Download
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-6 w-6 p-0"
      onClick={handleDownloadImage}
    >
      <Download className="h-3.5 w-3.5" />
    </Button>
  );
};

export default ImageDownloadButton;
