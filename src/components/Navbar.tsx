import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import AuthButtons from '@/components/AuthButtons';
import UserCredits from '@/components/UserCredits';
import { BrandLogo } from './navbar/BrandLogo';
import { DesktopNav } from './navbar/DesktopNav';
import { MobileMenu } from './navbar/MobileMenu';
import { MenuToggle } from './navbar/MenuToggle';
import { useAuth } from '@/hooks/use-auth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();

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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 py-3 backdrop-blur-lg bg-[rgba(var(--background-rgb),0.7)] shadow-sm border-b border-[rgba(var(--border),0.3)]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <BrandLogo />
        <DesktopNav isActive={isActive} />
        <div className="flex items-center gap-3">
          <UserCredits />
          <AuthButtons />
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
