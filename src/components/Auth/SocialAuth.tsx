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
      <CircleUser size={20} className="mr-2 text-[#4285F4]" />
      Continue with Google
    </Button>
  );
};

export default SocialAuth;
