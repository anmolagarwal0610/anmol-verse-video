
import { ExternalLink, FileVideo, Music, FileText, Archive, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DownloadButton from '@/components/ui/download-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VideoStatusResponse } from '@/lib/videoGenerationApi';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from 'sonner';

interface ResultCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  url: string;
  isPrimary?: boolean;
}

const ResultCard = ({ icon, title, description, url, isPrimary = false }: ResultCardProps) => {
  const isVideo = title.toLowerCase().includes('video');
  const fileType = 
    title === 'Video' ? 'video' : 
    title === 'Audio Track' ? 'audio' : 
    title === 'Transcript' ? 'transcript' : 
    title === 'Image Collection' ? 'archive' : 'video';
  
  const handleResourceAction = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    try {
      // For zip files, use a specific method and notify the user
      if (title === 'Image Collection') {
        toast.info(`Opening ${title} in a new tab`);
      }
      
      // Open all resources in a new tab
      window.open(url, '_blank');
    } catch (error) {
      console.error(`Failed to open ${title}:`, error);
      toast.error(`Unable to open ${title}. Please try again.`);
    }
  };
  
  const handleDownload = async (resourceUrl: string, resourceType: string) => {
    const toastId = toast.loading(`Downloading ${resourceType}...`);
    
    try {
      // Get file extension
      let fileExtension = '.mp4';
      if (resourceType === 'Audio Track') fileExtension = '.mp3';
      else if (resourceType === 'Transcript') fileExtension = '.txt';
      else if (resourceType === 'Image Collection') fileExtension = '.zip';
      
      // Create a filename
      const filename = `${resourceType.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}${fileExtension}`;
      
      // Fetch directly without proxy
      const response = await fetch(resourceUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download ${resourceType}`);
      }
      
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      toast.dismiss(toastId);
      toast.success(`${resourceType} download started`);
    } catch (error) {
      console.error(`Failed to download ${resourceType}:`, error);
      toast.dismiss(toastId);
      toast.error(`Unable to download ${resourceType}. Please try again.`);
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
        <CardFooter className="flex justify-between space-x-2">
          <DownloadButton 
            url={url} 
            fileType="video" 
            size="sm" 
            variant="default"
            className="h-8 px-3 text-xs"
          />
          <Button variant="outline" size="sm" asChild className="h-8 px-3 text-xs">
            <a href={url} target="_blank" rel="noopener noreferrer" onClick={handleResourceAction}>
              <ExternalLink className="mr-1 h-3.5 w-3.5" />
              Open
            </a>
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <TooltipProvider>
      <div className="flex items-center justify-between gap-3 p-2.5 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
            {icon}
          </div>
          <span className="font-medium">{title}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-8 w-8 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
              >
                <a href={url} target="_blank" rel="noopener noreferrer" onClick={handleResourceAction}>
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Open {title}</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open in new tab</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
                onClick={() => handleDownload(url, title)}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download {title}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download {fileType}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
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
        
        <div className="flex flex-col space-y-3 mt-4">
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
