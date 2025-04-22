
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Route mapping for prefetching
const ROUTE_MODULES = {
  'index': () => import('@/pages/Index'),
  'videos/generate': () => import('@/pages/VideoGeneration'),
  'images': () => import('@/pages/ImageGeneration'),
  'transcript': () => import('@/pages/Transcript'),
  'gallery': () => import('@/pages/Gallery'),
};

export const useIntelligentPrefetch = () => {
  const location = useLocation();
  const [prefetchedRoutes, setPrefetchedRoutes] = useState<string[]>([]);

  const prefetchRoute = (route: string) => {
    if (prefetchedRoutes.includes(route)) return;
    
    console.log(`🔍 Prefetching route: ${route}`);
    
    switch (route) {
      case 'index':
        import('@/pages/Index');
        break;
      case 'videos/generate':
        import('@/pages/VideoGeneration');
        break;
      case 'images':
        import('@/pages/ImageGeneration');
        break;
      case 'transcript':
        import('@/pages/Transcript');
        break;
      case 'gallery':
        import('@/pages/Gallery');
        break;
    }
    
    setPrefetchedRoutes(prev => [...prev, route]);
  };

  useEffect(() => {
    const prefetchRelatedRoutes = () => {
      if (location.pathname === '/') {
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(() => {
            prefetchRoute('videos/generate');
            prefetchRoute('images');
          });
        }
      } else if (location.pathname === '/videos/generate') {
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(() => {
            prefetchRoute('gallery');
            prefetchRoute('transcript');
          });
        }
      } else if (location.pathname === '/images') {
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(() => {
            prefetchRoute('gallery');
          });
        }
      }
    };
    
    const timer = setTimeout(prefetchRelatedRoutes, 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const initialPrefetch = () => {
      if (location.pathname === '/') {
        prefetchRoute('index');
      }
    };
    
    const timer = setTimeout(initialPrefetch, 2000);
    return () => clearTimeout(timer);
  }, []);

  return null;
};
