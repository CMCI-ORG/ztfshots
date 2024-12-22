import { DashboardMetrics } from "@/components/admin/dashboard/DashboardMetrics";
import { SearchFilterPanel } from "@/components/admin/dashboard/SearchFilterPanel";
import { RecentQuotes } from "@/components/admin/dashboard/RecentQuotes";
import { HeroSection } from "@/components/admin/dashboard/HeroSection";
import { QuickActions } from "@/components/admin/dashboard/QuickActions";
import { EngagementCharts } from "@/components/admin/dashboard/EngagementCharts";
import { AdminLayout } from "@/components/layout/AdminLayout";

const Dashboard = () => {
  return (
    <AdminLayout>
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
    </AdminLayout>
  );
};

export default Dashboard;