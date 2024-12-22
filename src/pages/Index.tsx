import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardMetrics } from "@/components/admin/dashboard/DashboardMetrics";
import { EngagementCharts } from "@/components/admin/dashboard/EngagementCharts";
import { QuickActions } from "@/components/admin/dashboard/QuickActions";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container mx-auto py-8 px-4 space-y-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <DashboardMetrics />
            <EngagementCharts />
            <QuickActions />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;