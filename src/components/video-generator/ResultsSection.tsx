
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
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ResultCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  url: string;
  isPrimary?: boolean;
}

const ResultCard = ({ icon, title, description, url, isPrimary = false }: ResultCardProps) => {
  const isVideo = title.toLowerCase().includes('video');
  
  const handleDownload = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isVideo) {
      event.preventDefault();
      window.open(url, '_blank');
    }
  };
  
  if (isVideo) {
    return (
      <Card className="w-full shadow-md border-indigo-300/50 dark:border-indigo-800/50">
        <CardHeader className="bg-indigo-50/50 dark:bg-indigo-900/10">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-indigo-100/80 dark:bg-indigo-800/20">
              {icon}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="rounded-md overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
            <video 
              src={url} 
              controls 
              className="w-full h-full object-contain"
              poster="/placeholder.svg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" asChild className="h-8 px-3 text-xs">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1 h-3.5 w-3.5" />
              Open
            </a>
          </Button>
          <Button variant="default" size="sm" asChild className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800">
            <a href={url} download onClick={handleDownload}>
              <Download className="mr-1 h-3.5 w-3.5" />
              Download
            </a>
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-9 px-3 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <a href={url} download onClick={handleDownload}>
              {icon}
              <span className="ml-2">{title}</span>
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface ResultsSectionProps {
  result: VideoStatusResponse;
}

const ResultsSection = ({ result }: ResultsSectionProps) => {
  if (!result) return null;
  
  const handleCreateNew = () => {
    // Force a page refresh when clicking "Create New Video"
    window.location.href = '/videos/generate';
  };
  
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Your Generated Content</h2>
      
      <div className="space-y-6">
        {result.video_url && (
          <div>
            <ResultCard
              icon={<FileVideo className="h-5 w-5 text-indigo-600" />}
              title="Video"
              description="Your generated video is ready to view or download"
              url={result.video_url}
              isPrimary
            />
          </div>
        )}
        
        <div className="flex items-center justify-center gap-2 mt-4">
          {result.audio_url && (
            <ResultCard
              icon={<Music className="h-4 w-4 text-blue-500" />}
              title="Audio Track"
              description="Audio extracted from your video"
              url={result.audio_url}
            />
          )}
          
          {result.transcript_url && (
            <ResultCard
              icon={<FileText className="h-4 w-4 text-green-500" />}
              title="Transcript"
              description="Text transcription of audio content"
              url={result.transcript_url}
            />
          )}
          
          {result.images_zip_url && (
            <ResultCard
              icon={<Archive className="h-4 w-4 text-amber-500" />}
              title="Image Collection"
              description="ZIP archive of all generated images"
              url={result.images_zip_url}
            />
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 hover:from-indigo-600/20 hover:to-purple-600/20"
          onClick={handleCreateNew}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Video
        </Button>
      </div>
    </div>
  );
};

export default ResultsSection;
