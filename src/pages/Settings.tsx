
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import Navbar from '@/components/Navbar';
import AdminCredits from '@/components/AdminCredits';
import ChangePasswordForm from '@/components/Auth/ChangePasswordForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container py-10">
          <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-pulse">Loading settings...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      <Navbar />
      <div className="container py-10 mt-10">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Account settings will be available in future updates.
                  </p>
                  
                  <div className="space-y-2">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Name:</strong> {user.user_metadata?.name || user.user_metadata?.full_name || 'Not set'}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Separator className="my-6" />
              
              <ChangePasswordForm />
            </div>
          </TabsContent>
          
          <TabsContent value="admin">
            <AdminCredits />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
