
// Configuration for the API
export const API_CONFIG = {
  BASE_URL: "https://flask-app-249297598302.asia-south1.run.app", // Flask API URL
  FALLBACK_BASE_URL: "https://api-fallback.example.com", // Fallback URL if primary fails
  CORS_PROXIES: [
    "https://corsproxy.io/?",
    "https://cors-anywhere.herokuapp.com/",
    "https://api.allorigins.win/raw?url="
  ]
};

// Helper function to try different CORS proxies
export const fetchWithCorsProxy = async (url: string, options: RequestInit = {}, proxyIndex = 0): Promise<Response> => {
  if (proxyIndex >= API_CONFIG.CORS_PROXIES.length) {
    // If all proxies fail, try direct request as last resort
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
    // Try next proxy
    return fetchWithCorsProxy(url, options, proxyIndex + 1);
  } catch (error) {
    console.error(`Proxy ${proxyIndex + 1} threw error:`, error);
    // Try next proxy
    return fetchWithCorsProxy(url, options, proxyIndex + 1);
  }
};
