import { Button } from "@/components/ui/button";
import { SubscriptionErrorBoundary } from "./SubscriptionErrorBoundary";
import { SubscriptionHeader } from "./form/SubscriptionHeader";
import { SubscriptionFields } from "./form/SubscriptionFields";
import { useSubscription } from "./form/useSubscription";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface SubscriptionFormProps {
  subscriptionType?: 'email' | 'whatsapp' | 'browser';
}

export const SubscriptionForm = ({ subscriptionType = 'email' }: SubscriptionFormProps) => {
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
    error,
    setName,
    setEmail,
    setNation,
    setNotifyNewQuotes,
    setNotifyWeeklyDigest,
    setNotifyWhatsapp,
    setWhatsappPhone,
    handleSubmit,
  } = useSubscription(subscriptionType);

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 p-6">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800">
            <h3 className="text-xl font-semibold mb-2">Thank you for subscribing!</h3>
            <p>Please check your {subscriptionType === 'email' ? 'email' : subscriptionType === 'whatsapp' ? 'WhatsApp' : 'browser notifications'} to verify your subscription.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-4 p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error}. Please try again or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <SubscriptionErrorBoundary>
      <div className="space-y-4">
        <SubscriptionHeader subscriptionType={subscriptionType} />
        
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
            disabled={isLoading}
            subscriptionType={subscriptionType}
          />
          <Button 
            type="submit" 
            className="w-full max-w-sm mx-auto bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors"
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