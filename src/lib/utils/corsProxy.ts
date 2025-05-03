
// Simple in-memory cache for URL responses
const responseCache: Record<string, { blob: Blob; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

export const fetchWithCorsProxy = async (url: string, options: RequestInit = {}, proxyIndex = 0): Promise<Response> => {
  console.log('🌐 fetchWithCorsProxy called with URL:', url);
  
  // Check the cache first
  const cacheKey = url + JSON.stringify(options);
  const cachedResponse = responseCache[cacheKey];
  
  if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
    console.log('🔄 Using cached response for URL:', url);
    return new Response(cachedResponse.blob);
  }

  // Define available CORS proxies
  const CORS_PROXIES = [
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest=',
    'https://api.allorigins.win/raw?url='
  ];

  // If maximum proxy attempts reached, try direct fetch
  if (proxyIndex >= CORS_PROXIES.length) {
    console.log("❌ All proxies failed, attempting direct request to:", url);
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        // Cache the successful response
        const blob = await response.clone().blob();
        console.log(`✅ Direct request successful, caching response (${blob.size} bytes)`);
        responseCache[cacheKey] = { blob, timestamp: Date.now() };
        return response;
      }
      console.log(`⚠️ Direct request failed with status: ${response.status}`);
      return response; // Return even if not ok, to preserve error status
    } catch (error) {
      console.error("❌ Direct request failed:", error);
      // Create a synthetic error response
      return new Response(JSON.stringify({ error: 'All proxy attempts failed' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Try with the current proxy
  const proxy = CORS_PROXIES[proxyIndex];
  const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
  
  console.log(`🔄 Trying CORS proxy ${proxyIndex + 1}/${CORS_PROXIES.length}:`, proxy);
  
  try {
    console.log(`🔍 Using proxy URL: ${proxyUrl.substring(0, 100)}...`);
    const response = await fetch(proxyUrl, options);
    
    if (response.ok) {
      console.log(`✅ Proxy ${proxyIndex + 1} successful`);
      
      // Cache the successful response
      const blob = await response.clone().blob();
      console.log(`✅ Caching proxy response (${blob.size} bytes)`);
      responseCache[cacheKey] = { blob, timestamp: Date.now() };
      
      return response;
    }
    
    console.log(`⚠️ Proxy ${proxyIndex + 1} failed with status:`, response.status);
    return fetchWithCorsProxy(url, options, proxyIndex + 1);
  } catch (error) {
    console.error(`❌ Proxy ${proxyIndex + 1} threw error:`, error);
    console.log(`🔄 Trying next proxy...`);
    return fetchWithCorsProxy(url, options, proxyIndex + 1);
  }
};
