import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/admin/dashboard/HeroSection";
import { QuickLinks } from "@/components/admin/dashboard/QuickLinks";
import { SearchFilterPanel } from "@/components/admin/dashboard/SearchFilterPanel";
import { RecentQuotes } from "@/components/admin/dashboard/RecentQuotes";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="min-h-screen bg-[#FEF7CD] bg-opacity-20">
            <HeroSection />
            <QuickLinks />
            <SearchFilterPanel />
            <RecentQuotes />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;