import { FeedSettings } from "@/components/admin/settings/feed/FeedSettings";

const FeedManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Feed Management</h2>
        <p className="text-muted-foreground">
          Configure your site's RSS feed display settings.
        </p>
      </div>
      <FeedSettings />
    </div>
  );
};

export default FeedManagement;