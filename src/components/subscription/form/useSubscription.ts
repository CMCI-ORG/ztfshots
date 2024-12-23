import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSubscription = () => {
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
      const { data, error } = await supabase.functions.invoke('subscribe', {
        body: { name, email },
      });

      if (error) {
        let errorBody;
        try {
          errorBody = typeof error.message === 'string' && error.message.includes('{') 
            ? JSON.parse(error.message)
            : error instanceof Error 
              ? { error: error.message }
              : typeof error === 'object' && error !== null && 'body' in error
                ? JSON.parse((error as any).body)
                : { error: 'Unknown error occurred' };
        } catch (e) {
          errorBody = { error: error.message || 'Unknown error occurred' };
        }

        if (errorBody.error?.includes('already subscribed')) {
          toast({
            title: "Already subscribed",
            description: "This email is already registered for our newsletter.",
            variant: "destructive",
          });
          return;
        }
        
        throw new Error(errorBody.error || 'Subscription failed');
      }

      toast({
        title: "Subscription successful!",
        description: "You'll receive daily ZTF inspiration in your inbox.",
      });

      setName("");
      setEmail("");

      const closeButton = document.querySelector('[data-radix-dialog-close]') as HTMLButtonElement;
      if (closeButton) {
        closeButton.click();
      }

    } catch (error: any) {
      console.error("Subscription error:", error);
      
      toast({
        title: "Subscription failed",
        description: error.message || "An error occurred while subscribing. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    email,
    isLoading,
    setName,
    setEmail,
    handleSubmit,
  };
};