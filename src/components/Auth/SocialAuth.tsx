import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

interface SocialAuthProps {
  isLoading: boolean;
}

const SocialAuth = ({ isLoading }: SocialAuthProps) => {
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setClicked(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          // PKCE is on by default in v2 client
        },
      });
      if (error) {
        console.error("[SocialAuth] Error during Google OAuth:", error);
        toast.error("Google Sign-In failed: " + (error.message || "Unknown error"));
        setClicked(false);
      }
      // Otherwise, the browser will be redirected (no need to handle here)
    } catch (err: any) {
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
      <span>
        <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48">
          <g>
            <path d="M44.5 20H24v8.5h11.6c-1.6 4.2-6.1 7-11.6 7-7 0-12.8-5.8-12.8-13S17 9 24 9c3.2 0 6.2 1.1 8.5 3.2l6.3-6.3C34.6 2.4 29.6 0 24 0 10.7 0 0 10.7 0 24s10.7 24 24 24c13 0 24-10.7 24-24 0-1.6-.2-3.2-.5-4.7z" fill="#FFC107"/>
            <path d="M6.3 14.7l7 5.1C15 16 19.2 13.4 24 13.4c3.2 0 6.2 1.1 8.5 3.2l6.3-6.3C34.6 2.4 29.6 0 24 0 14.8 0 6.7 6.7 6.3 14.7z" fill="#FF3D00"/>
            <path d="M24 48c5.6 0 10.6-1.9 14.5-5.1l-6.7-5.5c-2.1 1.6-4.9 2.6-7.8 2.6-5.4 0-10-3.7-11.6-8.8l-7 5.3C6.8 41.1 14.7 48 24 48z" fill="#4CAF50"/>
            <path d="M44.5 20H24v8.5h11.6c-.7 2.5-2.2 4.7-4.4 6.2V38h7c2.3-2.7 3.8-6.3 3.8-10.7 0-1-.1-2.1-.3-3.2z" fill="#1976D2"/>
          </g>
        </svg>
      </span>
      Continue with Google
    </Button>
  );
};

export default SocialAuth;
