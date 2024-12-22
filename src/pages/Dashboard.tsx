import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardMetrics } from "@/components/admin/dashboard/DashboardMetrics";
import { SearchFilterPanel } from "@/components/admin/dashboard/SearchFilterPanel";
import { RecentQuotes } from "@/components/admin/dashboard/RecentQuotes";
import { HeroSection } from "@/components/admin/dashboard/HeroSection";
import { QuickActions } from "@/components/admin/dashboard/QuickActions";
import { EngagementCharts } from "@/components/admin/dashboard/EngagementCharts";

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-6 px-4">
        <div className="space-y-6">
          <HeroSection />
          <DashboardMetrics />
          <QuickActions />
          <SearchFilterPanel />
          <EngagementCharts />
          <RecentQuotes />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;