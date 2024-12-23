import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Subscriber } from "@/integrations/supabase/types/users";

interface EditSubscriberDialogProps {
  subscriber: Subscriber | null;
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
  if (!subscriber) return null;

  return (
    <Dialog open={!!subscriber} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Subscriber</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onSubmit({
            id: subscriber.id,
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            notify_new_quotes: formData.get('notify_new_quotes') === 'on',
            notify_weekly_digest: formData.get('notify_weekly_digest') === 'on',
          });
        }}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={subscriber.name}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={subscriber.email}
                required
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notify_new_quotes">Notify about new quotes</Label>
                <Switch
                  id="notify_new_quotes"
                  name="notify_new_quotes"
                  defaultChecked={subscriber.notify_new_quotes}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notify_weekly_digest">Receive weekly digest</Label>
                <Switch
                  id="notify_weekly_digest"
                  name="notify_weekly_digest"
                  defaultChecked={subscriber.notify_weekly_digest}
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