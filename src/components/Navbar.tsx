
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import AuthButtons from '@/components/AuthButtons';
import UserCredits from '@/components/UserCredits';
import { BrandLogo } from './navbar/BrandLogo';
import { DesktopNav } from './navbar/DesktopNav';
import { MobileMenu } from './navbar/MobileMenu';
import { MenuToggle } from './navbar/MenuToggle';
import { createRouteObserver } from '@/utils/performance';
import VideoGenerationStatusIndicator from './VideoGenerationStatusIndicator';

// Define route mapping for prefetching
const ROUTE_MODULES: Record<string, () => Promise<any>> = {
  '/': () => import('@/pages/Index'),
  '/videos/generate': () => import('@/pages/VideoGeneration'),
  '/images': () => import('@/pages/ImageGeneration'),
  '/transcript': () => import('@/pages/Transcript'),
  '/gallery': () => import('@/pages/Gallery'),
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const prefetchedRoutes = useRef<Set<string>>(new Set());
  const navLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Pending redirect logic
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

  // Set up intersection observer for route prefetching
  useEffect(() => {
    if (isMobile) return; // Skip for mobile devices to save data
    
    const observer = createRouteObserver((entry) => {
      const linkElement = entry.target as HTMLAnchorElement;
      const href = linkElement.getAttribute('href');
      
      if (href && ROUTE_MODULES[href] && !prefetchedRoutes.current.has(href)) {
        console.log(`🔄 Prefetching route from navbar: ${href}`);
        
        // Prefetch the module
        ROUTE_MODULES[href]()
          .then(() => {
            console.log(`✅ Successfully prefetched: ${href}`);
            prefetchedRoutes.current.add(href);
          })
          .catch(err => {
            console.error(`❌ Failed to prefetch ${href}:`, err);
          });
      }
    });
    
    // Observe all navigation links
    if (navLinksRef.current && observer) {
      const links = navLinksRef.current.querySelectorAll('a[href]');
      links.forEach(link => {
        observer.observe(link);
      });
    }
    
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [isMobile]);

  // Prefetch on hover
  const handleLinkHover = (path: string) => {
    if (ROUTE_MODULES[path] && !prefetchedRoutes.current.has(path)) {
      console.log(`🔍 [Navbar] Prefetching on hover: ${path}`);
      ROUTE_MODULES[path]()
        .then(() => {
          prefetchedRoutes.current.add(path);
        })
        .catch(console.error);
    }
  };

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
        <BrandLogo />
        <div ref={navLinksRef}>
          <DesktopNav isActive={isActive} onLinkHover={handleLinkHover} />
        </div>
        <div className="flex items-center gap-3">
          <UserCredits />
          <VideoGenerationStatusIndicator />
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
