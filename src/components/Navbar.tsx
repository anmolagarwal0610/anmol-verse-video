
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react'; // Added Search icon
import { useIsMobile } from '@/hooks/use-mobile';
import AuthButtons from '@/components/AuthButtons';
import UserCredits from '@/components/UserCredits';
import { BrandLogo } from './navbar/BrandLogo';
import { DesktopNav } from './navbar/DesktopNav';
import { MobileMenu } from './navbar/MobileMenu';
import { MenuToggle } from './navbar/MenuToggle';
import ThemeToggle from '@/components/home/ThemeToggle'; // Import ThemeToggle
import { Button } from '@/components/ui/button'; // Import Button for Search icon

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

  useEffect(() => {
    const pendingPath = sessionStorage.getItem('pendingRedirectPath');
    
    if (pendingPath && pendingPath !== location.pathname) {
      console.log(`🔍 [Navbar] Found pending redirect path: ${pendingPath}`);
      console.log('🔍 [Navbar] Current path:', location.pathname);
      
      const lastRedirectTime = sessionStorage.getItem('lastNavRedirectTime');
      const currentTime = Date.now();
      
      if (lastRedirectTime && (currentTime - parseInt(lastRedirectTime)) < 2000) {
        console.log('🔍 [Navbar] Preventing redirect loop - redirected too recently');
        return;
      }
      
      sessionStorage.setItem('lastNavRedirectTime', currentTime.toString());
      
      if (location.pathname === '/' && pendingPath !== '/') {
        console.log(`🔍 [Navbar] On homepage, redirecting to pending path: ${pendingPath}`);
        navigate(pendingPath);
      }
    }
  }, [location, navigate]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 py-3 backdrop-blur-lg bg-off-black/70 shadow-md border-b border-border" // Updated background and border
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4"> {/* Container for logo and desktop nav */}
          <BrandLogo />
          <DesktopNav isActive={isActive} />
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-cloud-white hover:bg-sky-blue-tint/20">
            <Search className="h-5 w-5" />
          </Button>
          <UserCredits />
          <AuthButtons />
          <div className="relative"> {/* Wrapper for ThemeToggle to remove fixed positioning */}
            <ThemeToggle />
          </div>
          <MenuToggle isOpen={isMenuOpen} onToggle={toggleMenu} />
        </div>
      </div>

      <MobileMenu 
        isOpen={isMenuOpen} 
        isActive={isActive} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </motion.header>
  );
};

export default Navbar;
