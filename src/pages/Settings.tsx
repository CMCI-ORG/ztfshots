import { AdminLayout } from "@/components/layout/AdminLayout";
import { SiteSettings } from "@/components/admin/settings/SiteSettings";
import { SiteSettingsErrorBoundary } from "@/components/admin/settings/SiteSettingsErrorBoundary";

const Settings = () => {
  return (
    <AdminLayout>
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <SiteSettingsErrorBoundary>
          <SiteSettings />
        </SiteSettingsErrorBoundary>
      </main>
    </AdminLayout>
  );
};

export default Settings;