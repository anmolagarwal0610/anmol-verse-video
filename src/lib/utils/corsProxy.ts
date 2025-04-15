
import { API_CONFIG } from '../config/api';

export const fetchWithCorsProxy = async (url: string, options: RequestInit = {}, proxyIndex = 0): Promise<Response> => {
  if (proxyIndex >= API_CONFIG.CORS_PROXIES.length) {
    console.log("All proxies failed, attempting direct request to:", url);
    return fetch(url, options);
  }

  const proxy = API_CONFIG.CORS_PROXIES[proxyIndex];
  const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
  
  console.log(`Trying CORS proxy ${proxyIndex + 1}/${API_CONFIG.CORS_PROXIES.length}:`, proxy);
  console.log("Using proxy URL:", proxyUrl);
  
  try {
    const response = await fetch(proxyUrl, options);
    
    if (response.ok) {
      console.log(`Proxy ${proxyIndex + 1} successful`);
      return response;
    }
    
    console.log(`Proxy ${proxyIndex + 1} failed with status:`, response.status, response.statusText);
    return fetchWithCorsProxy(url, options, proxyIndex + 1);
  } catch (error) {
    console.error(`Proxy ${proxyIndex + 1} threw error:`, error);
    return fetchWithCorsProxy(url, options, proxyIndex + 1);
  }
};
