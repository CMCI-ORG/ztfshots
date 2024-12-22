import { SiteSettings } from "@/components/admin/settings/SiteSettings";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your site settings and preferences.
        </p>
      </div>
      <SiteSettings />
    </div>
  );
};

export default Settings;