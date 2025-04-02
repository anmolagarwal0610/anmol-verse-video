
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import UserMenu from "./UserMenu";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export default function AuthButtons() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // Only render after component is mounted to avoid hydration mismatch
  useEffect(() => {
    console.log('AuthButtons: Initial render, mounted:', mounted, 'loading:', loading, 'user:', user ? 'exists' : 'null');
    
    // Set mounted immediately rather than waiting for next render cycle
    setMounted(true);
    
    console.log('AuthButtons: Set mounted to true');
  }, []);

  // Log state changes
  useEffect(() => {
    console.log('AuthButtons: State changed - mounted:', mounted, 'loading:', loading, 'user:', user ? 'exists' : 'null');
  }, [mounted, loading, user]);

  // Show simplified loading state first
  if (!mounted || loading) {
    console.log('AuthButtons: Showing loading state');
    // Return a simpler loading state that doesn't depend on styles
    return <div>Loading...</div>;
  }

  // Show user menu if logged in
  if (user) {
    console.log('AuthButtons: Showing user menu');
    return <UserMenu />;
  }

  // Show login button if not logged in
  console.log('AuthButtons: Showing login button');
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
