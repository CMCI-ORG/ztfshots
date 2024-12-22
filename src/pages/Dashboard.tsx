import { DashboardMetrics } from "@/components/admin/dashboard/DashboardMetrics";
import { SearchFilterPanel } from "@/components/admin/dashboard/SearchFilterPanel";
import { RecentQuotes } from "@/components/admin/dashboard/RecentQuotes";
import { HeroSection } from "@/components/admin/dashboard/HeroSection";
import { QuickActions } from "@/components/admin/dashboard/QuickActions";
import { EngagementCharts } from "@/components/admin/dashboard/EngagementCharts";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container mx-auto py-6 px-4">
            <div className="space-y-6">
              <HeroSection />
              <DashboardMetrics />
              <QuickActions />
              <SearchFilterPanel />
              <EngagementCharts />
              <RecentQuotes />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;