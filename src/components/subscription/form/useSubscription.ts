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
  const [verificationSent, setVerificationSent] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+\d{1,3}\s\d{1,3}\s\d{4,14}$/;
    return !notifyWhatsapp || phoneRegex.test(phone);
  };

  const handleWhatsAppVerification = async (subscriberId: string) => {
    if (!whatsappPhone) return;

    try {
      const { error } = await supabase.functions.invoke('verify-whatsapp', {
        body: { 
          phone_number: whatsappPhone,
          subscriber_id: subscriberId
        },
      });

      if (error) throw error;

      setVerificationSent(true);
      toast({
        title: "WhatsApp Verification Sent",
        description: "Please check your WhatsApp for a verification message.",
      });
    } catch (error: any) {
      console.error("WhatsApp verification error:", error);
      toast({
        title: "WhatsApp Verification Failed",
        description: error.message || "Failed to send verification message",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhone(whatsappPhone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid WhatsApp phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('subscribe', {
        body: { 
          name, 
          email,
          nation: nation || null,
          notify_new_quotes: notifyNewQuotes,
          notify_weekly_digest: notifyWeeklyDigest,
          notify_whatsapp: notifyWhatsapp,
          whatsapp_phone: notifyWhatsapp ? whatsappPhone : null
        },
      });

      if (error) throw error;

      toast({
        title: "Subscription successful!",
        description: "You'll receive daily ZTF inspiration in your inbox.",
      });

      // If WhatsApp notification is enabled, send verification
      if (notifyWhatsapp && data?.subscriber_id) {
        await handleWhatsAppVerification(data.subscriber_id);
      }

      // Reset form
      setName("");
      setEmail("");
      setNation("");
      setNotifyNewQuotes(true);
      setNotifyWeeklyDigest(true);
      setNotifyWhatsapp(false);
      setWhatsappPhone("");
      setVerificationSent(false);

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
    nation,
    notifyNewQuotes,
    notifyWeeklyDigest,
    notifyWhatsapp,
    whatsappPhone,
    isLoading,
    verificationSent,
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