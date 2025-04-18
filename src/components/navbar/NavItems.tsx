
import { Link } from 'react-router-dom';
import { Film, ImageIcon, FileText, Video } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import VideoGenerationStatusIndicator from '@/components/VideoGenerationStatusIndicator';

export interface NavItem {
  path: string;
  label: string;
  icon: JSX.Element;
  disabled: boolean;
  comingSoon: boolean;
}

export const navItems: NavItem[] = [
  { 
    path: '/videos/generate', 
    label: 'Video', 
    icon: <Film className="h-4 w-4 mr-2" />,
    disabled: false,
    comingSoon: false
  },
  { 
    path: '/images', 
    label: 'Images', 
    icon: <ImageIcon className="h-4 w-4 mr-2" />,
    disabled: false,
    comingSoon: false
  },
  { 
    path: '/transcript', 
    label: 'Transcript', 
    icon: <FileText className="h-4 w-4 mr-2" />,
    disabled: false,
    comingSoon: false
  },
  { 
    path: '/gallery', 
    label: 'Gallery', 
    icon: <Video className="h-4 w-4 mr-2" />,
    disabled: false,
    comingSoon: false
  },
];

interface NavItemsProps {
  isActive: (path: string) => boolean;
  onMenuClose?: () => void;
  isMobile?: boolean;
}

export const NavItems = ({ isActive, onMenuClose, isMobile }: NavItemsProps) => {
  return navItems.map((item) => (
    <div key={item.path} className="flex items-center">
      <Button
        variant={isActive(item.path) ? "default" : "ghost"}
        size="sm"
        className={cn(
          "transition-all duration-300 relative",
          isActive(item.path) ? "bg-gradient-to-r from-indigo-600 to-purple-700 text-white" : "",
          item.disabled ? "opacity-60 cursor-not-allowed" : "",
          isMobile && "justify-start w-full"
        )}
        onClick={() => !item.disabled && onMenuClose?.()}
        asChild={!item.disabled}
        disabled={item.disabled}
      >
        {!item.disabled ? (
          <Link to={item.path} className="flex items-center">
            {item.icon}
            {item.label}
          </Link>
        ) : (
          <div className="flex items-center">
            {item.icon}
            {item.label}
            {item.comingSoon && (
              <div className="absolute top-1 right-2 bg-yellow-500 text-black text-[8px] px-1 rounded-full">
                Soon
              </div>
            )}
          </div>
        )}
      </Button>
      
      {item.path === '/videos/generate' && (
        <div className="ml-1">
          <VideoGenerationStatusIndicator />
        </div>
      )}
    </div>
  ));
};
