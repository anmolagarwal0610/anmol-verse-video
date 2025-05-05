
import { useState } from 'react';
import { Check, Download, Film, Headphones, FileText, FileArchive, Copy, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoStatusResponse } from '@/lib/video/types';
import { useAuth } from '@/hooks/use-auth';
import { saveVideoToGallery } from '@/lib/video/services/videoGallery';
import VideoPlayer from '@/components/video-player/VideoPlayer'; // Direct import from the component file
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import DownloadButton from '@/components/ui/download-button';

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
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Video Generation Complete</h2>
      
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden">
        {result.video_url && (
          <VideoPlayer
            videoUrl={result.video_url}
            poster={result.thumbnail_url || undefined}
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
            {result.video_url && (
              <DownloadButton
                url={result.video_url}
                fileType="video"
                filename={`video-${Date.now()}.mp4`}
                size="sm"
                className="flex items-center gap-2"
              />
            )}
            
            {result.audio_url && (
              <DownloadButton
                url={result.audio_url}
                fileType="audio"
                filename={`audio-${Date.now()}.mp3`}
                size="sm"
                className="flex items-center gap-2"
              />
            )}
            
            {result.transcript_url && (
              <DownloadButton
                url={result.transcript_url}
                fileType="transcript"
                filename={`transcript-${Date.now()}.txt`}
                size="sm"
                className="flex items-center gap-2"
              />
            )}
            
            {result.images_zip_url && (
              <DownloadButton
                url={result.images_zip_url}
                fileType="archive"
                filename={`images-${Date.now()}.zip`}
                size="sm"
                className="flex items-center gap-2"
              />
            )}
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
