
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Music, FileText, Archive, Download, AlertCircle } from 'lucide-react';
import { VideoData } from '@/components/video-card';
import { isPast } from 'date-fns';
import { toast } from 'sonner';

interface VideoResourcesProps {
  video: VideoData;
}

const VideoResources = ({ video }: VideoResourcesProps) => {
  if (!video.audioUrl && !video.transcriptUrl && !video.imagesZipUrl) {
    return null;
  }
  
  // Check if video is expired
  const isExpired = video.expiryTime && isPast(new Date(video.expiryTime));

  const handleResourceClick = (url: string | undefined, resourceType: string) => {
    if (isExpired) {
      toast.error(`This ${resourceType} has expired and is no longer available`);
      return;
    }
    
    if (!url) {
      toast.error(`The ${resourceType} URL is invalid`);
      return;
    }
    
    window.open(url, '_blank');
  };

  return (
    <motion.div 
      className="glass-panel rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4">Resources</h2>
      {isExpired ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">
            Resources have expired and are no longer available
          </p>
        </div>
      ) : (
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
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleResourceClick(video.audioUrl, 'audio')}
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download Audio</span>
                  </Button>
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
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleResourceClick(video.transcriptUrl, 'transcript')}
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download Transcript</span>
                  </Button>
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
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleResourceClick(video.imagesZipUrl, 'images archive')}
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download Images</span>
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </motion.div>
  );
};

export default VideoResources;
