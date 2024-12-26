import { useEffect } from "react";
import { NotificationHistory } from "@/components/admin/notifications/NotificationHistory";
import { TestDigestButton } from "@/components/admin/subscribers/TestDigestButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { checkRateLimit } from "@/utils/rateLimiting";
import { useToast } from "@/components/ui/use-toast";

export default function Notifications() {
  const { toast } = useToast();

  useEffect(() => {
    const checkAccess = async () => {
      const canAccess = await checkRateLimit('notifications_page');
      if (!canAccess) {
        toast({
          title: "Rate limit exceeded",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    };

    checkAccess();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notification History</h1>
        <TestDigestButton />
      </div>
      
      <ErrorBoundary>
        <NotificationHistory />
      </ErrorBoundary>
    </div>
  );
}