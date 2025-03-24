
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AdminCredits = () => {
  const [userId, setUserId] = useState('');
  const [credits, setCredits] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      toast.error('Please enter a user ID');
      return;
    }
    
    if (!credits.trim() || isNaN(Number(credits)) || Number(credits) < 0) {
      toast.error('Please enter a valid number of credits');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.rpc('adjust_user_credits', {
        target_user_id: userId,
        credit_amount: Number(credits)
      });
      
      if (error) {
        throw error;
      }
      
      toast.success(`Successfully updated credits for user ${userId}`);
      setUserId('');
      setCredits('');
    } catch (error) {
      console.error('Error adjusting credits:', error);
      toast.error('Failed to update user credits');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Adjust User Credits</CardTitle>
        <CardDescription>
          Set the number of credits for a specific user
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user UUID"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credits">Number of Credits</Label>
            <Input
              id="credits"
              type="number"
              min="0"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              placeholder="Enter number of credits"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Credits'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <p>Admin use only</p>
      </CardFooter>
    </Card>
  );
};

export default AdminCredits;
