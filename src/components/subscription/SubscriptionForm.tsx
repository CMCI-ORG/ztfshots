import { Button } from "@/components/ui/button";
import { SubscriptionErrorBoundary } from "./SubscriptionErrorBoundary";
import { SubscriptionHeader } from "./form/SubscriptionHeader";
import { SubscriptionFields } from "./form/SubscriptionFields";
import { useSubscription } from "./form/useSubscription";

export const SubscriptionForm = () => {
  const {
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
  } = useSubscription();

  return (
    <SubscriptionErrorBoundary>
      <div className="space-y-4">
        <SubscriptionHeader />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <SubscriptionFields
            name={name}
            email={email}
            nation={nation}
            notifyNewQuotes={notifyNewQuotes}
            notifyWeeklyDigest={notifyWeeklyDigest}
            notifyWhatsapp={notifyWhatsapp}
            whatsappPhone={whatsappPhone}
            onNameChange={setName}
            onEmailChange={setEmail}
            onNationChange={setNation}
            onNotifyNewQuotesChange={setNotifyNewQuotes}
            onNotifyWeeklyDigestChange={setNotifyWeeklyDigest}
            onNotifyWhatsappChange={setNotifyWhatsapp}
            onWhatsappPhoneChange={setWhatsappPhone}
          />
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