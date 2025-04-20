
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Music, FileText, Archive, Download } from 'lucide-react';
import { VideoData } from '@/components/video-card';

interface VideoResourcesProps {
  video: VideoData;
}

const VideoResources = ({ video }: VideoResourcesProps) => {
  if (!video.audioUrl && !video.transcriptUrl && !video.imagesZipUrl) {
    return null;
  }

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
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.open(video.audioUrl, '_blank')}
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
                  onClick={() => window.open(video.transcriptUrl, '_blank')}
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
                  onClick={() => window.open(video.imagesZipUrl, '_blank')}
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download Images</span>
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default VideoResources;
