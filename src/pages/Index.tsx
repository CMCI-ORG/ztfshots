import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { QuoteStats } from "@/components/analytics/QuoteStats";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Analytics Overview</h2>
              <QuoteStats />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;