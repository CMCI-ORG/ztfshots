import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const subscriptionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  nation: z.string().optional(),
  notify_new_quotes: z.boolean(),
  notify_weekly_digest: z.boolean(),
  notify_whatsapp: z.boolean(),
  whatsapp_phone: z.string().optional(),
});

export const useSubscription = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nation, setNation] = useState("");
  const [notifyNewQuotes, setNotifyNewQuotes] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setName("");
    setEmail("");
    setNation("");
    setNotifyNewQuotes(true);
    setNotifyWeeklyDigest(true);
    setNotifyWhatsapp(false);
    setWhatsappPhone("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate form data
      const subscriptionData = {
        name,
        email,
        nation,
        notify_new_quotes: notifyNewQuotes,
        notify_weekly_digest: notifyWeeklyDigest,
        notify_whatsapp: notifyWhatsapp,
        whatsapp_phone: whatsappPhone,
      };

      const validatedData = subscriptionSchema.parse(subscriptionData);

      // Check for existing subscription
      const { data: existingSubscriber } = await supabase
        .from("users")
        .select("email, email_status")
        .eq("email", email)
        .maybeSingle();

      if (existingSubscriber) {
        if (existingSubscriber.email_status === "pending") {
          setError("Please check your email to verify your subscription");
          return;
        }
        
        setError("This email is already subscribed to our newsletter");
        return;
      }

      // Call the subscribe edge function
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Subscription failed");
      }

      setIsSuccess(true);
      resetForm();
      
      toast({
        title: "Subscription successful!",
        description: "Please check your email to verify your subscription.",
      });
    } catch (error) {
      console.error("Subscription error:", error);
      
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const firstError = error.errors[0];
        setError(firstError.message);
      } else {
        setError(error instanceof Error ? error.message : "Please try again later");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    email,
    nation,
    notifyNewQuotes,
    notifyWeeklyDigest,
    notifyWhatsapp,
    whatsappPhone,
    isLoading,
    isSuccess,
    error,
    setName,
    setEmail,
    setNation,
    setNotifyNewQuotes,
    setNotifyWeeklyDigest,
    setNotifyWhatsapp,
    setWhatsappPhone,
    handleSubmit,
  };
};