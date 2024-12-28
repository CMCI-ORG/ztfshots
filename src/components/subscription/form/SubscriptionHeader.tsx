interface SubscriptionHeaderProps {
  subscriptionType?: 'email' | 'whatsapp' | 'browser';
}

export const SubscriptionHeader = ({ subscriptionType = 'email' }: SubscriptionHeaderProps) => {
  const getHeaderText = () => {
    switch (subscriptionType) {
      case 'whatsapp':
        return "Get Daily Inspiration on WhatsApp";
      case 'browser':
        return "Get Browser Notifications";
      default:
        return "Get Daily Inspiration in Your Inbox";
    }
  };

  const getDescriptionText = () => {
    switch (subscriptionType) {
      case 'whatsapp':
        return "Receive uplifting quotes directly on WhatsApp. Stay connected with daily spiritual insights from Prof. Z.T. Fomum.";
      case 'browser':
        return "Never miss an inspiring quote with browser notifications. Get timely spiritual insights from Prof. Z.T. Fomum.";
      default:
        return "Subscribe to receive daily quotes that will uplift your spirit and strengthen your faith. Each day, you'll get a carefully selected quote from Prof. Z.T. Fomum's teachings.";
    }
  };

  return (
    <div className="text-center space-y-2">
      <h2 className="text-xl font-semibold text-[#2B4C7E]">
        {getHeaderText()}
      </h2>
      <p className="text-sm text-muted-foreground">
        {getDescriptionText()}
      </p>
    </div>
  );
};