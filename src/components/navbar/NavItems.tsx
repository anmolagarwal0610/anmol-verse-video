
import { Link } from 'react-router-dom';
import { Film, ImageIcon, FileText, Video } from 'lucide-react'; // Keep Video for Gallery for now
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

// Menu items: Video | Images | Transcript | Gallery
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
    icon: <Video className="h-4 w-4 mr-2" />, // Changed to Video or specific Gallery icon if available
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
        variant="ghost" // Default to ghost for non-active items
        size="sm"
        className={cn(
          "transition-all duration-300 relative text-cloud-white hover:bg-sky-blue-tint/20 hover:text-light-cyan",
          isActive(item.path) ? "bg-sky-blue-tint text-off-black font-semibold" : "font-light", // Active state uses Sky Blue Tint
          item.disabled ? "opacity-50 cursor-not-allowed text-muted-foreground" : "",
          isMobile && "justify-start w-full"
        )}
        onClick={() => !item.disabled && onMenuClose?.()}
        asChild={!item.disabled}
        disabled={item.disabled}
      >
        {!item.disabled ? (
          <Link to={item.path} className="flex items-center px-3 py-1.5"> {/* Added padding for better click area */}
            {item.icon}
            {item.label}
          </Link>
        ) : (
          <div className="flex items-center px-3 py-1.5"> {/* Added padding */}
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
