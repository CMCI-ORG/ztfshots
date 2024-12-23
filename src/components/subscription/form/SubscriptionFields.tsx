import { Input } from "@/components/ui/input";

interface SubscriptionFieldsProps {
  name: string;
  email: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

export const SubscriptionFields = ({
  name,
  email,
  onNameChange,
  onEmailChange,
}: SubscriptionFieldsProps) => {
  return (
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
  );
};