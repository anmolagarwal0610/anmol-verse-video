
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import AuthButtons from '@/components/AuthButtons';
import UserCredits from '@/components/UserCredits';
import Logo from '@/components/Logo';
import { DesktopNav } from './navbar/DesktopNav';
import { MobileMenu } from './navbar/MobileMenu';

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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 py-3 backdrop-blur-lg bg-white/70 dark:bg-black/70 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Logo />
          <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
            DumbLabs.AI
          </span>
        </Link>

        <DesktopNav isActive={isActive} />

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

      <MobileMenu 
        isOpen={isMenuOpen} 
        isActive={isActive} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </motion.header>
  );
};

export default Navbar;
