
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Music, FileText, Archive, ExternalLink, Download } from 'lucide-react';
import { VideoData } from '@/components/video-card';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VideoResourcesProps {
  video: VideoData;
}

const VideoResources = ({ video }: VideoResourcesProps) => {
  if (!video.audioUrl && !video.transcriptUrl && !video.imagesZipUrl) {
    return null;
  }

  const handleResourceAction = (url: string | undefined, resourceType: string) => {
    if (!url) return;
    
    try {
      // For all resources, open in a new tab with proper message
      if (resourceType === 'Images Archive') {
        toast.info(`Opening ${resourceType} in a new tab`);
      }
      
      // Open in a new tab
      window.open(url, '_blank');
    } catch (error) {
      console.error(`Failed to open ${resourceType}:`, error);
      toast.error(`Unable to open ${resourceType}. Please try again.`);
    }
  };

  const handleDownload = (url: string | undefined, resourceType: string) => {
    if (!url) return;
    
    try {
      const downloadUrl = url;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${resourceType.toLowerCase().replace(' ', '_')}_${new Date().toISOString().slice(0, 10)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${resourceType} download started`);
    } catch (error) {
      console.error(`Failed to download ${resourceType}:`, error);
      toast.error(`Unable to download ${resourceType}. Please try again.`);
    }
  };

  return (
    <motion.div 
      className="glass-panel rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4">Resources</h2>
      <div className="space-y-3">
        {video.audioUrl && (
          <div className="flex items-center justify-between gap-3 p-2.5 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                <Music className="h-4 w-4 text-blue-500" />
              </div>
              <span className="font-medium">Audio</span>
            </div>
            
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
                    >
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleResourceAction(video.audioUrl, 'Audio');
                      }}>
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Open Audio</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open in new tab</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
                      onClick={() => handleDownload(video.audioUrl, 'Audio')}
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download Audio</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download audio</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
          
        {video.transcriptUrl && (
          <div className="flex items-center justify-between gap-3 p-2.5 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                <FileText className="h-4 w-4 text-green-500" />
              </div>
              <span className="font-medium">Transcript</span>
            </div>
            
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
                    >
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleResourceAction(video.transcriptUrl, 'Transcript');
                      }}>
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Open Transcript</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open in new tab</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
                      onClick={() => handleDownload(video.transcriptUrl, 'Transcript')}
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download Transcript</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download transcript</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
          
        {video.imagesZipUrl && (
          <div className="flex items-center justify-between gap-3 p-2.5 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                <Archive className="h-4 w-4 text-amber-500" />
              </div>
              <span className="font-medium">Images Archive</span>
            </div>
            
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
                    >
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleResourceAction(video.imagesZipUrl, 'Images Archive');
                      }}>
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Open Images Archive</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open in new tab</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
                      onClick={() => handleDownload(video.imagesZipUrl, 'Images Archive')}
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download Images Archive</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download images</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VideoResources;
