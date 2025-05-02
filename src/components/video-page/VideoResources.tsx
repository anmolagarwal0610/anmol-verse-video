
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Music, FileText, Archive, ExternalLink } from 'lucide-react';
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

  return (
    <motion.div 
      className="glass-panel rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4">Resources</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {video.audioUrl && (
            <TableRow>
              <TableCell className="flex items-center">
                <Music className="h-4 w-4 mr-2 text-blue-500" />
                <span>Audio</span>
              </TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleResourceAction(video.audioUrl, 'Audio')}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Open Audio</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open in new tab</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          )}
          
          {video.transcriptUrl && (
            <TableRow>
              <TableCell className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-green-500" />
                <span>Transcript</span>
              </TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleResourceAction(video.transcriptUrl, 'Transcript')}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Open Transcript</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open in new tab</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          )}
          
          {video.imagesZipUrl && (
            <TableRow>
              <TableCell className="flex items-center">
                <Archive className="h-4 w-4 mr-2 text-amber-500" />
                <span>Images Archive</span>
              </TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleResourceAction(video.imagesZipUrl, 'Images Archive')}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Open Images Archive</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open in new tab</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default VideoResources;
