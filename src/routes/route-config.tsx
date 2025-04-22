
import { lazy } from 'react';

// Lazy load pages with better naming for debugging
export const Index = lazy(() => 
  import('@/pages/Index').then(module => {
    console.log('✅ Index page loaded');
    return module;
  })
);

export const Auth = lazy(() => 
  import('@/pages/Auth').then(module => {
    console.log('✅ Auth page loaded');
    return module;
  })
);

export const AuthCallback = lazy(() => import('@/pages/AuthCallback'));

export const Transcript = lazy(() => 
  import('@/pages/Transcript').then(module => {
    console.log('✅ Transcript page loaded');
    return module;
  })
);

export const Video = lazy(() => import('@/pages/Video'));

export const VideoGeneration = lazy(() => 
  import('@/pages/VideoGeneration').then(module => {
    console.log('✅ VideoGeneration page loaded');
    return module;
  })
);

export const ImageGeneration = lazy(() => 
  import('@/pages/ImageGeneration').then(module => {
    console.log('✅ ImageGeneration page loaded');
    return module;
  })
);

export const Gallery = lazy(() => 
  import('@/pages/Gallery').then(module => {
    console.log('✅ Gallery page loaded');
    return module;
  })
);

export const Profile = lazy(() => import('@/pages/Profile'));
export const Settings = lazy(() => import('@/pages/Settings'));
export const NotFound = lazy(() => import('@/pages/NotFound'));
