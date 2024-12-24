import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import countries from "world-countries";

// Prepare countries data outside component for better performance
const sortedCountries = countries
  .map(country => ({
    label: country.name.common,
    value: country.name.common
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

interface SubscriptionFieldsProps {
  name: string;
  email: string;
  nation: string;
  notifyNewQuotes: boolean;
  notifyWeeklyDigest: boolean;
  notifyWhatsapp: boolean;
  whatsappPhone: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onNationChange: (value: string) => void;
  onNotifyNewQuotesChange: (value: boolean) => void;
  onNotifyWeeklyDigestChange: (value: boolean) => void;
  onNotifyWhatsappChange: (value: boolean) => void;
  onWhatsappPhoneChange: (value: string) => void;
}

export const SubscriptionFields = ({
  name,
  email,
  nation,
  notifyNewQuotes,
  notifyWeeklyDigest,
  notifyWhatsapp,
  whatsappPhone,
  onNameChange,
  onEmailChange,
  onNationChange,
  onNotifyNewQuotesChange,
  onNotifyWeeklyDigestChange,
  onNotifyWhatsappChange,
  onWhatsappPhoneChange,
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
        <div className="max-w-sm mx-auto">
          <Label htmlFor="nation" className="text-sm text-muted-foreground">
            Country (Optional)
          </Label>
          <Select 
            value={nation} 
            onValueChange={onNationChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your country..." />
            </SelectTrigger>
            <SelectContent>
              {sortedCountries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
        {/* WhatsApp options temporarily hidden
        <div className="flex items-center justify-between">
          <Label htmlFor="notify-whatsapp" className="text-sm">
            Receive WhatsApp notifications
          </Label>
          <Switch
            id="notify-whatsapp"
            checked={notifyWhatsapp}
            onCheckedChange={onNotifyWhatsappChange}
          />
        </div>
        {notifyWhatsapp && (
          <div className="space-y-2">
            <Label htmlFor="whatsapp-phone" className="text-sm">
              WhatsApp Phone Number
            </Label>
            <PhoneInput
              id="whatsapp-phone"
              value={whatsappPhone}
              onChange={onWhatsappPhoneChange}
              placeholder="Enter your WhatsApp number"
              required={notifyWhatsapp}
              className="max-w-sm mx-auto"
            />
          </div>
        )}
        */}
      </div>
    </div>
  );
};