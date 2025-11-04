
export const API_CONFIG = {
  BASE_URL: "https://flask-app-249297598302.asia-south1.run.app",
  // API_KEY removed - now handled securely in Supabase edge functions
  // All API calls should go through Supabase edge functions instead of direct API calls
  FALLBACK_BASE_URL: "https://api-fallback.example.com",
  CORS_PROXIES: [
    "https://api.allorigins.win/raw?url=",
    "https://corsproxy.io/?",
    "https://cors-anywhere.herokuapp.com/"
  ]
} as const;
