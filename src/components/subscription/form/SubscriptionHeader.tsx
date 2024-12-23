import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const SubscriptionHeader = () => {
  return (
    <div className="text-center space-y-2">
      <DialogTitle id="subscription-title" className="text-lg font-semibold text-[#8B5CF6]">
        Daily ZTF Inspiration
      </DialogTitle>
      <DialogDescription id="subscription-description" className="text-sm text-muted-foreground">
        Get daily ZTF inspiration delivered straight to your inbox!
      </DialogDescription>
    </div>
  );
};