import { NotificationHistory } from "@/components/admin/notifications/NotificationHistory";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notification History</h1>
      </div>
      
      <ErrorBoundary>
        <NotificationHistory />
      </ErrorBoundary>
    </div>
  );
}