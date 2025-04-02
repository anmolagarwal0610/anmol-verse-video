
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import UserMenu from "./UserMenu";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthButtons() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // Only render after component is mounted to avoid hydration mismatch
  useEffect(() => {
    console.log('[AuthButtons] Component mounted effect triggered');
    console.log('[AuthButtons] Initial state - mounted:', mounted, 'loading:', loading, 'user:', user ? 'exists' : 'null');
    
    // Set mounted immediately rather than waiting for next render cycle
    setMounted(true);
    
    console.log('[AuthButtons] Set mounted to true');
  }, []);

  // Log state changes
  useEffect(() => {
    console.log('[AuthButtons] State changed - mounted:', mounted, 'loading:', loading, 'user:', user ? 'exists' : 'null');
  }, [mounted, loading, user]);

  // Separate effect for debug timing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('[AuthButtons] Debug check after 5s - mounted:', mounted, 'loading:', loading);
      if (loading) {
        console.warn('[AuthButtons] Auth still loading after 5s');
      }
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [loading]);

  // Show better loading state - skeleton instead of text
  if (!mounted) {
    console.log('[AuthButtons] Not mounted yet, showing loading skeleton');
    return <Skeleton className="h-9 w-24" />;
  }

  if (loading) {
    console.log('[AuthButtons] Auth is loading, showing loading skeleton');
    return <Skeleton className="h-9 w-24" />;
  }

  // Show user menu if logged in
  if (user) {
    console.log('[AuthButtons] User authenticated, showing user menu');
    return <UserMenu />;
  }

  // Show login button if not logged in
  console.log('[AuthButtons] User not authenticated, showing login button');
  return (
    <Button 
      onClick={() => navigate("/auth")}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 flex items-center gap-2 rounded-full shadow-sm hover:shadow-md transition-all"
    >
      <LogIn className="h-4 w-4" />
      <span>Sign In</span>
    </Button>
  );
}
