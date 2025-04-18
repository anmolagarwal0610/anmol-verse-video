
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, Video, Menu, X, FileText, ImageIcon, Film, Star, Sparkles } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import AuthButtons from '@/components/AuthButtons';
import UserCredits from '@/components/UserCredits';
import VideoGenerationStatusIndicator from '@/components/VideoGenerationStatusIndicator';
import Logo from '@/components/Logo';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Check for redirection after login
  useEffect(() => {
    const pendingPath = sessionStorage.getItem('pendingRedirectPath');
    
    if (pendingPath && pendingPath !== location.pathname) {
      console.log(`Redirecting to pending path: ${pendingPath}`);
      navigate(pendingPath);
    }
  }, [location, navigate]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { 
      path: '/videos/generate', 
      label: 'Video', 
      icon: <Film className="h-4 w-4 mr-2" />,
      disabled: false,
      comingSoon: false
    },
    { path: '/images', label: 'Images', icon: <ImageIcon className="h-4 w-4 mr-2" /> },
    { path: '/transcript', label: 'Transcript', icon: <FileText className="h-4 w-4 mr-2" /> },
    { path: '/gallery', label: 'Gallery', icon: <Video className="h-4 w-4 mr-2" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 py-3 backdrop-blur-lg bg-white/70 dark:bg-black/70 shadow-sm"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Logo />
          <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">DumbLabs.AI</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <div key={item.path} className="flex items-center">
              <Button
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "transition-all duration-300 relative",
                  isActive(item.path) ? "bg-gradient-to-r from-indigo-600 to-purple-700 text-white" : "",
                  item.disabled ? "opacity-60 cursor-not-allowed" : ""
                )}
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
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[8px] px-1 rounded-full">Soon</div>
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
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <UserCredits />
          <AuthButtons />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <motion.nav 
          className="md:hidden fixed top-[60px] left-0 right-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-lg border-t z-50 max-h-[calc(100vh-60px)] overflow-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.path} className="flex items-center">
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={cn(
                    "justify-start w-full relative",
                    isActive(item.path) ? "bg-gradient-to-r from-indigo-600 to-purple-700 text-white" : "",
                    item.disabled ? "opacity-60 cursor-not-allowed" : ""
                  )}
                  onClick={() => !item.disabled && setIsMenuOpen(false)}
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
                        <div className="absolute top-1 right-2 bg-yellow-500 text-black text-[8px] px-1 rounded-full">Soon</div>
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
            ))}
          </div>
        </motion.nav>
      )}
    </motion.header>
  );
};

export default Navbar;
