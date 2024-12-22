import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { SiteSettings } from "@/components/admin/settings/SiteSettings";
import { SiteSettingsErrorBoundary } from "@/components/admin/settings/SiteSettingsErrorBoundary";

const Settings = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container mx-auto py-6 px-4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Settings</h1>
            </div>
            <SiteSettingsErrorBoundary>
              <SiteSettings />
            </SiteSettingsErrorBoundary>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;