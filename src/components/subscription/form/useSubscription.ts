import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useSubscription = (type: 'email' | 'whatsapp' | 'browser' = 'email') => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create new user with subscription preferences
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            name,
            email,
            nation,
            notify_new_quotes: type === 'email' ? notifyNewQuotes : false,
            notify_weekly_digest: type === 'email' ? notifyWeeklyDigest : false,
            notify_whatsapp: type === 'whatsapp' ? notifyWhatsapp : false,
            whatsapp_phone: type === 'whatsapp' ? whatsappPhone : null,
            role: 'subscriber',
            status: 'active'
          }
        ]);

      if (insertError) {
        if (insertError.code === '23505') { // Unique violation
          throw new Error('This email is already subscribed');
        }
        throw insertError;
      }

      setIsSuccess(true);
      toast({
        title: "Subscription Successful!",
        description: `Thank you for subscribing to our ${type} updates!`,
      });
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.message || 'Failed to process your subscription. Please try again.');
      toast({
        variant: "destructive",
        title: "Subscription Failed",
        description: err.message || "There was an error processing your subscription. Please try again.",
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