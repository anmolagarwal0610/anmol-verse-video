
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import UserMenu from "./UserMenu";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthButtons() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Add useLocation hook
  const [mounted, setMounted] = useState(false);
  const [isAuthPage, setIsAuthPage] = useState(false);

  // Check if we're on the auth page whenever location changes
  useEffect(() => {
    const currentPath = location.pathname;
    setIsAuthPage(currentPath === '/auth');
    console.log('[AuthButtons] Location changed, current path:', currentPath, 'isAuthPage:', currentPath === '/auth');
  }, [location]);

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

  // Don't render anything on auth page
  if (isAuthPage) {
    console.log('[AuthButtons] On auth page, not rendering auth buttons');
    return null;
  }

  // Show user menu if logged in
  if (user) {
    console.log('[AuthButtons] Rendering user menu for:', user.email);
    return <UserMenu />;
  }

  // Navigate to auth page with the sign-up tab selected when the Get Started button is clicked
  const handleGetStarted = () => {
    console.log('[AuthButtons] Get Started button clicked, navigating to /auth with sign-up tab');
    
    // If we're not already on the auth page, store the current path for redirect after login
    if (location.pathname !== '/auth') {
      sessionStorage.setItem('pendingRedirectPath', location.pathname);
      // Always set the default tab to sign-up for the Get Started button
      sessionStorage.setItem('authDefaultTab', 'sign-up');
      console.log('[AuthButtons] Stored authDefaultTab as "sign-up" for redirect');
    }
    
    navigate("/auth");
  };
  
  // Navigate to auth page when login icon is clicked
  const handleSignIn = () => {
    console.log('[AuthButtons] Sign in button clicked, navigating to /auth');
    
    // If we're not already on the auth page, store the current path for redirect after login
    if (location.pathname !== '/auth') {
      sessionStorage.setItem('pendingRedirectPath', location.pathname);
      sessionStorage.setItem('authDefaultTab', 'sign-in');
      console.log('[AuthButtons] Stored authDefaultTab as "sign-in" for redirect');
    }
    
    navigate("/auth");
  };

  // Show login button if not logged in
  console.log('[AuthButtons] Rendering login buttons (not authenticated)');
  return (
    <div className="flex items-center gap-3">
      <Button 
        onClick={handleGetStarted}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 rounded-full shadow-sm hover:shadow-md transition-all"
      >
        <span className="hidden sm:inline">Get Started for Free</span>
        <span className="sm:hidden">Sign Up</span>
      </Button>
      
      <Button 
        onClick={handleSignIn}
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Sign In"
      >
        <LogIn className="h-5 w-5" />
      </Button>
    </div>
  );
}

