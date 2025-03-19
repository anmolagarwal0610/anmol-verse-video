
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface VideoData {
  id: string;
  prompt: string;
  url: string;
  thumbnail: string;
  createdAt: string;
}

interface VideoCardProps {
  video: VideoData;
  index?: number;
}

const VideoCard = ({ video, index = 0 }: VideoCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/video/${video.id}`} className="block aspect-[9/16] overflow-hidden">
        {isLoading && (
          <Skeleton className="h-full w-full absolute inset-0" />
        )}
        <img
          src={video.thumbnail}
          alt={video.prompt}
          className={cn(
            "h-full w-full object-cover transition-all duration-300 group-hover:scale-105",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between">
              <Button size="icon" variant="secondary" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                <Play className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium line-clamp-1">{video.prompt}</h3>
            <p className="text-xs text-muted-foreground">
              {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
