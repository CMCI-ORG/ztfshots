import { DashboardMetrics } from "@/components/admin/dashboard/DashboardMetrics";
import { SearchFilterPanel } from "@/components/admin/dashboard/SearchFilterPanel";
import { RecentQuotes } from "@/components/admin/dashboard/RecentQuotes";
import { HeroSection } from "@/components/admin/dashboard/HeroSection";
import { QuickActions } from "@/components/admin/dashboard/QuickActions";
import { EngagementCharts } from "@/components/admin/dashboard/EngagementCharts";
import { SubscriberAnalytics } from "@/components/admin/dashboard/SubscriberAnalytics";
import { DashboardErrorBoundary } from "@/components/admin/dashboard/DashboardErrorBoundary";
import { GlobalUsersMap } from "@/components/admin/dashboard/maps/GlobalUsersMap";
import { DemographicCharts } from "@/components/admin/dashboard/analytics/DemographicCharts";

const Dashboard = () => {
  return (
    <DashboardErrorBoundary>
      <div className="space-y-6">
        <HeroSection />
        <DashboardMetrics />
        <GlobalUsersMap />
        <DemographicCharts />
        <QuickActions />
        <SearchFilterPanel />
        <EngagementCharts />
        <SubscriberAnalytics />
        <RecentQuotes />
      </div>
    </DashboardErrorBoundary>
  );
};

export default Dashboard;