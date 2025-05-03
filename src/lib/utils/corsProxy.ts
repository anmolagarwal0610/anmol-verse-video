
import { API_CONFIG } from '../config/api';

export const fetchWithCorsProxy = async (url: string, options: RequestInit = {}, proxyIndex = 0): Promise<Response> => {
  // Prioritize the working proxy (api.allorigins.win) as the first option
  const reorderedProxies = [
    "https://api.allorigins.win/raw?url=",
    ...API_CONFIG.CORS_PROXIES.filter(proxy => proxy !== "https://api.allorigins.win/raw?url=")
  ];
  
  if (proxyIndex >= reorderedProxies.length) {
    console.log("All proxies failed, attempting direct request to:", url);
    return fetch(url, options);
  }

  const proxy = reorderedProxies[proxyIndex];
  const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
  
  console.log(`Trying CORS proxy ${proxyIndex + 1}/${reorderedProxies.length}:`, proxy);
  console.log("Using proxy URL:", proxyUrl);
  
  try {
    const response = await fetch(proxyUrl, options);
    
    if (response.ok) {
      console.log(`Proxy ${proxyIndex + 1} successful with status:`, response.status);
      return response;
    }
    
    console.log(`Proxy ${proxyIndex + 1} failed with status:`, response.status, response.statusText);
    // Try the next proxy
    return fetchWithCorsProxy(url, options, proxyIndex + 1);
  } catch (error) {
    console.error(`Proxy ${proxyIndex + 1} threw error:`, error);
    // Try the next proxy
    return fetchWithCorsProxy(url, options, proxyIndex + 1);
  }
};
