
import { API_CONFIG } from '../config/api';

// Simple in-memory cache for URL responses
const responseCache: Record<string, { blob: Blob; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

export const fetchWithCorsProxy = async (url: string, options: RequestInit = {}, proxyIndex = 0): Promise<Response> => {
  // Check the cache first
  const cacheKey = url + JSON.stringify(options);
  const cachedResponse = responseCache[cacheKey];
  
  if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
    console.log('Using cached response for URL:', url);
    return new Response(cachedResponse.blob);
  }

  // If maximum proxy attempts reached, try direct fetch
  if (proxyIndex >= API_CONFIG.CORS_PROXIES.length) {
    console.log("All proxies failed, attempting direct request to:", url);
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        // Cache the successful response
        const blob = await response.clone().blob();
        responseCache[cacheKey] = { blob, timestamp: Date.now() };
        return response;
      }
      return response; // Return even if not ok, to preserve error status
    } catch (error) {
      console.error("Direct request failed:", error);
      // Create a synthetic error response
      return new Response(JSON.stringify({ error: 'All proxy attempts failed' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Try with the current proxy
  const proxy = API_CONFIG.CORS_PROXIES[proxyIndex];
  const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
  
  console.log(`Trying CORS proxy ${proxyIndex + 1}/${API_CONFIG.CORS_PROXIES.length}:`, proxy);
  console.log("Using proxy URL:", proxyUrl);
  
  try {
    const response = await fetch(proxyUrl, options);
    
    if (response.ok) {
      console.log(`Proxy ${proxyIndex + 1} successful`);
      
      // Cache the successful response
      const blob = await response.clone().blob();
      responseCache[cacheKey] = { blob, timestamp: Date.now() };
      
      return response;
    }
    
    console.log(`Proxy ${proxyIndex + 1} failed with status:`, response.status, response.statusText);
    return fetchWithCorsProxy(url, options, proxyIndex + 1);
  } catch (error) {
    console.error(`Proxy ${proxyIndex + 1} threw error:`, error);
    return fetchWithCorsProxy(url, options, proxyIndex + 1);
  }
};
