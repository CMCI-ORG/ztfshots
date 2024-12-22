import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/layout/PageHeader";
import { SiteSettings } from "@/components/admin/settings/SiteSettings";
import { SiteSettingsErrorBoundary } from "@/components/admin/settings/SiteSettingsErrorBoundary";

const Settings = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <PageHeader 
            title="Settings" 
            subtitle="Customize your site's appearance and configuration"
          />
          <main className="container mx-auto py-6 px-4">
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