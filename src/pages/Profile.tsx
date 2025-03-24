
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-pulse">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const getAvatarUrl = () => {
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    return null;
  };

  const getInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="grid gap-8 md:grid-cols-[1fr_3fr]">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={getAvatarUrl()} />
                <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{user.email}</CardTitle>
            <CardDescription>Joined {new Date(user.created_at).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button variant="outline" onClick={() => navigate("/settings")}>
              Account Settings
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <div className="text-lg">{user.email}</div>
            </div>
            <Separator />
            <div>
              <Label>Authentication Method</Label>
              <div className="text-lg capitalize">
                {user.app_metadata?.provider || "Email"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
