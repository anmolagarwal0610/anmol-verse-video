
/**
 * Performance monitoring utilities for tracking page load times
 */

// Track page transition time
export const startPageTransition = (pageName: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.time(`⏱️ Page transition to ${pageName}`);
    window.performance.mark(`page-transition-start-${pageName}`);
  }
};

export const endPageTransition = (pageName: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.timeEnd(`⏱️ Page transition to ${pageName}`);
    window.performance.mark(`page-transition-end-${pageName}`);
    
    try {
      window.performance.measure(
        `page-transition-${pageName}`,
        `page-transition-start-${pageName}`,
        `page-transition-end-${pageName}`
      );
      
      const measurements = window.performance.getEntriesByName(`page-transition-${pageName}`, 'measure');
      if (measurements.length > 0) {
        const duration = measurements[0].duration;
        console.log(`📊 Page transition to ${pageName} took ${duration.toFixed(2)}ms`);
      }
    } catch (e) {
      console.error('Error measuring page transition:', e);
    }
  }
};

// Check if a route is visible to the user
export const isElementInViewport = (el: Element) => {
  const rect = el.getBoundingClientRect();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Create an intersection observer for route prefetching
export const createRouteObserver = (callback: (entry: IntersectionObserverEntry) => void) => {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    }, {
      rootMargin: '200px', // Start observing when element is 200px from viewport
      threshold: 0.1
    });
  }
  return null;
};

// Cache control helper
export const markRouteVisited = (route: string) => {
  try {
    const visitedRoutes = JSON.parse(sessionStorage.getItem('visitedRoutes') || '[]');
    if (!visitedRoutes.includes(route)) {
      visitedRoutes.push(route);
      sessionStorage.setItem('visitedRoutes', JSON.stringify(visitedRoutes));
    }
  } catch (e) {
    console.error('Error marking route as visited:', e);
  }
};

export const hasVisitedRoute = (route: string): boolean => {
  try {
    const visitedRoutes = JSON.parse(sessionStorage.getItem('visitedRoutes') || '[]');
    return visitedRoutes.includes(route);
  } catch (e) {
    console.error('Error checking if route was visited:', e);
    return false;
  }
};
