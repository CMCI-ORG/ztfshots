import { Button } from "@/components/ui/button";
import { SubscriptionErrorBoundary } from "./SubscriptionErrorBoundary";
import { SubscriptionHeader } from "./form/SubscriptionHeader";
import { SubscriptionFields } from "./form/SubscriptionFields";
import { useSubscription } from "./form/useSubscription";
import { Loader2 } from "lucide-react";

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
    isSuccess,
    setName,
    setEmail,
    setNation,
    setNotifyNewQuotes,
    setNotifyWeeklyDigest,
    setNotifyWhatsapp,
    setWhatsappPhone,
    handleSubmit,
  } = useSubscription();

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 p-6">
        <h3 className="text-xl font-semibold text-green-600">Thank you for subscribing!</h3>
        <p className="text-gray-600">
          Please check your email to verify your subscription.
        </p>
      </div>
    );
  }

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
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              "Subscribe Now"
            )}
          </Button>
        </form>
      </div>
    </SubscriptionErrorBoundary>
  );
};