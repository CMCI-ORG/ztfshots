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
      // Create a simple object with just the data we need
      const subscriptionData = {
        name,
        email,
        nation,
        notify_new_quotes: notifyNewQuotes,
        notify_weekly_digest: notifyWeeklyDigest,
        notify_whatsapp: notifyWhatsapp,
        whatsapp_phone: whatsappPhone,
      };

      // Call the Edge Function with the subscription data
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

      // Insert into users table
      const { error: dbError } = await supabase
        .from('users')
        .insert([subscriptionData]);

      if (dbError) throw dbError;

      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing. You'll receive a confirmation email shortly.",
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