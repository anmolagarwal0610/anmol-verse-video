
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
    console.log('[AuthButtons] Component mounted, loading:', loading, 'user:', user ? 'exists' : 'null');
    setMounted(true);
  }, []);

  // Debug effect for auth state changes
  useEffect(() => {
    if (mounted) {
      console.log('[AuthButtons] Auth state changed - loading:', loading, 'user:', user ? user.email : 'null');
    }
  }, [loading, user, mounted]);

  // Show loading skeleton when not mounted or while auth is loading
  if (!mounted || loading) {
    return <Skeleton className="h-9 w-24" />;
  }

  // Show user menu if logged in
  if (user) {
    console.log('[AuthButtons] Rendering user menu for:', user.email);
    return <UserMenu />;
  }

  // Show login button if not logged in
  console.log('[AuthButtons] Rendering login button (not authenticated)');
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
