import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SubscriptionFieldsProps {
  name: string;
  email: string;
  notifyNewQuotes: boolean;
  notifyWeeklyDigest: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onNotifyNewQuotesChange: (value: boolean) => void;
  onNotifyWeeklyDigestChange: (value: boolean) => void;
}

export const SubscriptionFields = ({
  name,
  email,
  notifyNewQuotes,
  notifyWeeklyDigest,
  onNameChange,
  onEmailChange,
  onNotifyNewQuotesChange,
  onNotifyWeeklyDigestChange,
}: SubscriptionFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
          className="max-w-sm mx-auto"
          aria-label="Name"
        />
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className="max-w-sm mx-auto"
          aria-label="Email"
        />
      </div>
      
      <div className="space-y-3 max-w-sm mx-auto">
        <div className="flex items-center justify-between">
          <Label htmlFor="notify-quotes" className="text-sm">
            Receive daily quote notifications
          </Label>
          <Switch
            id="notify-quotes"
            checked={notifyNewQuotes}
            onCheckedChange={onNotifyNewQuotesChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="notify-digest" className="text-sm">
            Receive weekly digest
          </Label>
          <Switch
            id="notify-digest"
            checked={notifyWeeklyDigest}
            onCheckedChange={onNotifyWeeklyDigestChange}
          />
        </div>
      </div>
    </div>
  );
};