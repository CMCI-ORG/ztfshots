import { SidebarProvider } from "@/components/ui/sidebar";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { FilterSidebar } from "@/components/client-portal/quotes/FilterSidebar";
import { MainLayout } from "@/components/layout/MainLayout";

const ClientQuotes = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FEF7CD] bg-opacity-20">
        <SidebarProvider>
          <div className="flex min-h-screen w-full flex-col">
            <div className="flex flex-1">
              <FilterSidebar />
              <main className="flex-1">
                <div className="max-w-7xl mx-auto">
                  <QuotesGrid />
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </MainLayout>
  );
};

export default ClientQuotes;