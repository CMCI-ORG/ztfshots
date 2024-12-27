import { useEffect } from "react";
import { NotificationHistory } from "@/components/admin/notifications/NotificationHistory";
import { NotificationManager } from "@/components/admin/notifications/NotificationManager";
import { TestDigestButton } from "@/components/admin/subscribers/TestDigestButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { checkRateLimit } from "@/utils/rateLimiting";
import { useToast } from "@/hooks/use-toast";

export default function Notifications() {
  const { toast } = useToast();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const canAccess = await checkRateLimit('notifications_page');
        if (!canAccess) {
          toast({
            title: "Rate limit exceeded",
            description: "Please try again later.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error checking rate limit:', error);
        toast({
          title: "Notice",
          description: "Could not verify rate limit. Proceeding with limited functionality.",
          variant: "default",
        });
      }
    };

    checkAccess();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <TestDigestButton />
      </div>
      
      <ErrorBoundary>
        <NotificationManager />
      </ErrorBoundary>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Notification History</h2>
        <ErrorBoundary>
          <NotificationHistory />
        </ErrorBoundary>
      </div>
    </div>
  );
}