import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

export function TestDigestButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleTestDigest = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send a test digest",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-weekly-digest', {
        body: { 
          isTestMode: true,
          selectedUsers: [user.id]
        }
      });

      if (error) {
        console.error('Error sending test digest:', error);
        throw error;
      }

      toast({
        title: "Test Digest Sent",
        description: "Check your email for the test weekly digest.",
      });
    } catch (error: any) {
      console.error('Error sending test digest:', error);
      
      // Handle specific error cases
      const errorMessage = error.message?.includes('No users selected')
        ? "Failed to send test digest - no users selected"
        : error.message?.includes('rate limit')
        ? "Rate limit exceeded. Please wait a few minutes and try again."
        : "Failed to send test digest. Check the console for details.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleTestDigest}
      disabled={isLoading || !user}
      variant="outline"
    >
      {isLoading ? "Sending..." : "Send Test Digest"}
    </Button>
  );
}