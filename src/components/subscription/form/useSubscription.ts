import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSubscription = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nation, setNation] = useState("");
  const [notifyNewQuotes, setNotifyNewQuotes] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check for existing unverified subscription
      const { data: existingVerification } = await supabase
        .from("email_verifications")
        .select("*")
        .eq("email", email)
        .is("verified_at", null)
        .single();

      if (existingVerification) {
        const timeSinceLastAttempt = existingVerification.last_attempt_at 
          ? new Date().getTime() - new Date(existingVerification.last_attempt_at).getTime()
          : Infinity;

        // If last attempt was less than 5 minutes ago
        if (timeSinceLastAttempt < 5 * 60 * 1000) {
          toast({
            title: "Please wait",
            description: "A verification email was recently sent. Please check your inbox or wait a few minutes to try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      const subscriptionData = {
        name,
        email,
        nation,
        notify_new_quotes: notifyNewQuotes,
        notify_weekly_digest: notifyWeeklyDigest,
        notify_whatsapp: notifyWhatsapp,
        whatsapp_phone: whatsappPhone,
      };

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      toast({
        title: "Verification email sent!",
        description: "Please check your inbox to complete your subscription.",
      });

      // Reset form
      setName("");
      setEmail("");
      setNation("");
      setNotifyNewQuotes(true);
      setNotifyWeeklyDigest(true);
      setNotifyWhatsapp(false);
      setWhatsappPhone("");
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription failed",
        description: "There was a problem with your subscription. Please try again.",
        variant: "destructive",
      });
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