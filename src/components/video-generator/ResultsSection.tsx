
import { Download, ExternalLink, FileVideo, Music, FileText, Archive, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VideoStatusResponse } from '@/lib/videoGenerationApi';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface ResultCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  url: string;
  isPrimary?: boolean;
}

const ResultCard = ({ icon, title, description, url, isPrimary = false }: ResultCardProps) => {
  const isVideo = title.toLowerCase().includes('video');
  
  // Function to handle click on download links
  const handleDownload = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // This prevents the default behavior which would navigate away
    // Instead we'll handle the download in a new tab
    if (!isVideo) {
      event.preventDefault();
      window.open(url, '_blank');
    }
  };
  
  return (
    <Card className={`w-full shadow-md ${isPrimary ? 'border-purple-300 dark:border-purple-800' : ''}`}>
      <CardHeader className={`${isPrimary ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}>
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-full ${isPrimary ? 'bg-purple-100 dark:bg-purple-800/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {isVideo ? (
          <div className="rounded-md overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <video 
              src={url} 
              controls 
              className="w-full h-full object-contain"
              poster="/placeholder.svg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="flex justify-center p-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400">
            <p className="text-sm">{title} ready for download</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {isVideo ? (
          <>
            <Button variant="outline" size="sm" asChild className="h-8 px-3 text-xs">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3.5 w-3.5" />
                Open
              </a>
            </Button>
            <Button variant="default" size="sm" asChild className="h-8 px-3 text-xs">
              <a href={url} download onClick={handleDownload}>
                <Download className="mr-1 h-3.5 w-3.5" />
                Download
              </a>
            </Button>
          </>
        ) : (
          <Button variant="default" size="sm" asChild className="h-8 px-3 text-xs">
            <a href={url} download onClick={handleDownload}>
              <Download className="mr-1 h-3.5 w-3.5" />
              Download
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

interface ResultsSectionProps {
  result: VideoStatusResponse;
}

const ResultsSection = ({ result }: ResultsSectionProps) => {
  const { user } = useAuth();
  
  if (!result) return null;
  
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Your Generated Content</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.video_url && (
          <div className="md:col-span-2">
            <ResultCard
              icon={<FileVideo className="h-5 w-5 text-purple-600" />}
              title="Video"
              description="Your generated video is ready to view or download"
              url={result.video_url}
              isPrimary
            />
          </div>
        )}
        
        {result.audio_url && (
          <ResultCard
            icon={<Music className="h-5 w-5 text-blue-500" />}
            title="Audio Track"
            description="Audio extracted from your video"
            url={result.audio_url}
          />
        )}
        
        {result.transcript_url && (
          <ResultCard
            icon={<FileText className="h-5 w-5 text-green-500" />}
            title="Transcript"
            description="Text transcription of audio content"
            url={result.transcript_url}
          />
        )}
        
        {result.images_zip_url && (
          <ResultCard
            icon={<Archive className="h-5 w-5 text-amber-500" />}
            title="Image Collection"
            description="ZIP archive of all generated images"
            url={result.images_zip_url}
          />
        )}
      </div>
      
      <div className="mt-8 text-center">
        <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
          <Link to="/videos/generate" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create New Video
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ResultsSection;
