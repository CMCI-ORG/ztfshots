import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User } from "@/integrations/supabase/types/users";
import DOMPurify from "dompurify";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface EditSubscriberDialogProps {
  subscriber: User | null;
  onClose: () => void;
  onSubmit: (data: {
    id: string;
    name: string;
    email: string;
    notify_new_quotes: boolean;
    notify_weekly_digest: boolean;
  }) => void;
}

export function EditSubscriberDialog({ subscriber, onClose, onSubmit }: EditSubscriberDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    notify_new_quotes: false,
    notify_weekly_digest: false,
  });
  const { toast } = useToast();

  // Update form data when subscriber changes
  useState(() => {
    if (subscriber) {
      setFormData({
        name: DOMPurify.sanitize(subscriber.name),
        email: DOMPurify.sanitize(subscriber.email),
        notify_new_quotes: subscriber.notify_new_quotes || false,
        notify_weekly_digest: subscriber.notify_weekly_digest || false,
      });
    }
  });

  if (!subscriber) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      id: subscriber.id,
      ...formData,
    });
  };

  return (
    <Dialog open={!!subscriber} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Subscriber</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notify_new_quotes">Notify about new quotes</Label>
                <Switch
                  id="notify_new_quotes"
                  name="notify_new_quotes"
                  checked={formData.notify_new_quotes}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notify_new_quotes: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notify_weekly_digest">Receive weekly digest</Label>
                <Switch
                  id="notify_weekly_digest"
                  name="notify_weekly_digest"
                  checked={formData.notify_weekly_digest}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notify_weekly_digest: checked }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}