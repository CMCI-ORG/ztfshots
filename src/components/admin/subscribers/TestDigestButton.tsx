import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function TestDigestButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTestDigest = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-weekly-digest', {
        body: { 
          isTestMode: true,
          testEmail: "cmfionline@gmail.com" // Using the verified email address
        }
      });

      if (error) throw error;

      toast({
        title: "Test Digest Sent",
        description: "Check your email for the test weekly digest.",
      });
    } catch (error: any) {
      console.error('Error sending test digest:', error);
      toast({
        title: "Error",
        description: "Failed to send test digest. Check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleTestDigest}
      disabled={isLoading}
      variant="outline"
    >
      {isLoading ? "Sending..." : "Send Test Digest"}
    </Button>
  );
}