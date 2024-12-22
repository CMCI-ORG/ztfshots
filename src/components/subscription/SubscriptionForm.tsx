import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionErrorBoundary } from "./SubscriptionErrorBoundary";
import { DialogClose } from "@radix-ui/react-dialog";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const SubscriptionForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting to subscribe with:", { name, email });
      
      const { data, error } = await supabase.functions.invoke('subscribe', {
        body: { name, email },
      });

      console.log("Subscription response:", { data, error });

      if (error) throw error;

      // Find the close button and click it
      const closeButton = document.querySelector('[data-dialog-close]') as HTMLButtonElement;
      if (closeButton) {
        closeButton.click();
      }

      toast({
        title: "Subscription successful!",
        description: "You'll receive daily ZTF inspiration in your inbox.",
      });

      setName("");
      setEmail("");
    } catch (error: any) {
      console.error("Subscription error:", error);
      
      // Handle specific error cases
      if (error.message?.includes("already subscribed")) {
        toast({
          title: "Already subscribed",
          description: "This email is already registered for our newsletter.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Subscription failed",
          description: error.message || "Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SubscriptionErrorBoundary>
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <DialogTitle id="subscription-title" className="text-lg font-semibold text-[#8B5CF6]">
            Daily ZTF Inspiration
          </DialogTitle>
          <DialogDescription id="subscription-description" className="text-sm text-muted-foreground">
            Get daily ZTF inspiration delivered straight to your inbox!
          </DialogDescription>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="max-w-sm mx-auto"
              aria-label="Name"
            />
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="max-w-sm mx-auto"
              aria-label="Email"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full max-w-sm mx-auto bg-[#8B5CF6] hover:bg-[#7C3AED]"
            disabled={isLoading}
            aria-label={isLoading ? "Subscribing..." : "Subscribe Now"}
          >
            {isLoading ? "Subscribing..." : "Subscribe Now"}
          </Button>
        </form>
      </div>
    </SubscriptionErrorBoundary>
  );
};