import { AdminLayout } from "@/components/layout/AdminLayout";
import { SiteSettings } from "@/components/admin/settings/SiteSettings";
import { SiteSettingsErrorBoundary } from "@/components/admin/settings/SiteSettingsErrorBoundary";

const Settings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <SiteSettingsErrorBoundary>
          <SiteSettings />
        </SiteSettingsErrorBoundary>
      </div>
    </AdminLayout>
  );
};

export default Settings;