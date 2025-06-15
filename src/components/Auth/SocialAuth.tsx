
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { CircleUser } from "lucide-react";

interface SocialAuthProps {
  isLoading: boolean;
}

const SocialAuth = ({ isLoading }: SocialAuthProps) => {
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    console.log('🔍 [SocialAuth] Google sign-in initiated');
    setClicked(true);
    
    try {
      // Log pre-auth state
      console.log('🔍 [SocialAuth] Pre-auth localStorage state:');
      const preAuthKeys = Object.keys(localStorage).filter(key => key.includes('supabase'));
      console.log('🔍 [SocialAuth] Existing Supabase keys:', preAuthKeys);
      
      // Clear any existing PKCE verifiers to start fresh
      const existingPkceVerifier = localStorage.getItem('supabase.auth.pkce_verifier');
      if (existingPkceVerifier) {
        console.log('🔍 [SocialAuth] Clearing existing PKCE verifier:', existingPkceVerifier);
        localStorage.removeItem('supabase.auth.pkce_verifier');
      }
      
      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log('🔍 [SocialAuth] Using redirect URL:', redirectUrl);
      
      console.log('🔍 [SocialAuth] Calling signInWithOAuth...');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          // PKCE is on by default in v2 client
        },
      });
      
      if (error) {
        console.error("[SocialAuth] Error during Google OAuth:", error);
        toast.error("Google Sign-In failed: " + (error.message || "Unknown error"));
        setClicked(false);
        return;
      }
      
      // Log post-auth initiation state
      console.log('🔍 [SocialAuth] OAuth initiation successful');
      const postAuthKeys = Object.keys(localStorage).filter(key => key.includes('supabase'));
      console.log('🔍 [SocialAuth] Post-initiation Supabase keys:', postAuthKeys);
      
      const newPkceVerifier = localStorage.getItem('supabase.auth.pkce_verifier');
      console.log('🔍 [SocialAuth] New PKCE verifier created:', newPkceVerifier ? 'yes' : 'no');
      if (newPkceVerifier) {
        console.log('🔍 [SocialAuth] PKCE verifier value:', newPkceVerifier);
      }
      
      // Browser will be redirected, so this code won't execute normally
      console.log('🔍 [SocialAuth] Browser should now redirect to Google...');
      
    } catch (err: any) {
      console.error("[SocialAuth] Exception during Google OAuth:", err);
      toast.error("Google Sign-In failed: " + (err?.message || "Unknown error"));
      setClicked(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center gap-2 font-medium"
      disabled={isLoading || clicked}
      type="button"
    >
      <CircleUser size={20} className="mr-2 text-[#4285F4]" />
      Continue with Google
    </Button>
  );
};

export default SocialAuth;
