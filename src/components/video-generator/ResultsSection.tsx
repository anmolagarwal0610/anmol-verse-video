
import { useState } from 'react';
import { Check, Download, Film, Headphones, FileText, FileArchive, Copy, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoStatusResponse } from '@/lib/video/types';
import { useAuth } from '@/hooks/use-auth';
import { saveVideoToGallery } from '@/lib/video/services/videoGallery';
import { VideoPlayer } from '@/components/video-player';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface ResultsSectionProps {
  result: VideoStatusResponse;
}

interface ResourceButtonProps {
  icon: React.ReactNode;
  label: string;
  url?: string | null;
  onClick?: () => void;
  disabled?: boolean;
}

const ResultsSection = ({ result }: ResultsSectionProps) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});
  
  const handleSaveToGallery = async () => {
    if (!user || !result) return;
    
    try {
      setIsSaving(true);
      const success = await saveVideoToGallery(result, user.id);
      if (success) {
        toast.success('Video saved to your gallery!');
      }
    } catch (error) {
      console.error('Error saving video to gallery:', error);
      toast.error('Failed to save video');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus({ ...copyStatus, [type]: true });
      setTimeout(() => setCopyStatus({ ...copyStatus, [type]: false }), 2000);
      toast.success(`${type} URL copied to clipboard`);
    }).catch(() => {
      toast.error(`Failed to copy ${type} URL`);
    });
  };

  const handleDownload = (url: string, filename: string) => {
    try {
      // Create a direct link to download the file
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file. Please try again.');
    }
  };
  
  const ResourceButton = ({ icon, label, url, onClick, disabled = false }: ResourceButtonProps) => {
    return (
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onClick}
        disabled={disabled || !url}
      >
        {icon}
        <span>{label}</span>
      </Button>
    );
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Video Generation Complete</h2>
      
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden">
        {result.video_url && (
          <VideoPlayer
            videoUrl={result.video_url}
            posterUrl={result.thumbnail_url || undefined}
          />
        )}
      </div>
      
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold">Video Details</h3>
        
        {result.topic && (
          <div>
            <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Topic</h4>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md flex justify-between items-start">
              <p className="text-sm">{result.topic}</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500"
                onClick={() => handleCopyText(result.topic || '', 'Topic')}
              >
                {copyStatus['Topic'] ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
        
        <div>
          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Resources</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <ResourceButton
              icon={<Film className="h-4 w-4" />}
              label="Video"
              url={result.video_url}
              onClick={() => handleCopyText(result.video_url || '', 'Video')}
              disabled={!result.video_url}
            />
            
            <ResourceButton
              icon={<Headphones className="h-4 w-4" />}
              label="Audio"
              url={result.audio_url}
              onClick={() => result.audio_url && handleDownload(result.audio_url, `audio-${Date.now()}.mp3`)}
              disabled={!result.audio_url}
            />
            
            <ResourceButton
              icon={<FileText className="h-4 w-4" />}
              label="Transcript"
              url={result.transcript_url}
              onClick={() => result.transcript_url && handleDownload(result.transcript_url, `transcript-${Date.now()}.txt`)}
              disabled={!result.transcript_url}
            />
            
            <ResourceButton
              icon={<FileArchive className="h-4 w-4" />}
              label="Images"
              url={result.images_zip_url}
              onClick={() => result.images_zip_url && handleDownload(result.images_zip_url, `images-${Date.now()}.zip`)}
              disabled={!result.images_zip_url}
            />
          </div>
        </div>
        
        {user && (
          <>
            <Separator className="my-2" />
            
            <Button
              variant="default"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={handleSaveToGallery}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Download className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save to Gallery
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultsSection;
