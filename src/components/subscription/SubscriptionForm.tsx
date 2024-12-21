import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const SubscriptionForm = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email subscription logic
    toast({
      title: "Subscribed!",
      description: "You'll receive daily quotes in your inbox.",
    });
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Get Daily Quotes in Your Inbox</h3>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="max-w-sm"
        />
        <Button type="submit">Subscribe</Button>
      </div>
    </form>
  );
};