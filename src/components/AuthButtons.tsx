
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import UserMenu from "./UserMenu";
import { LogIn } from "lucide-react";

export default function AuthButtons() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="h-10 w-20 bg-muted animate-pulse rounded-md" />;
  }

  if (user) {
    return <UserMenu />;
  }

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
