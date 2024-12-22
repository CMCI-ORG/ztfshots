import { SidebarProvider } from "@/components/ui/sidebar";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { FilterSidebar } from "@/components/client-portal/quotes/FilterSidebar";
import { Navbar } from "@/components/layout/Navbar";

const ClientQuotes = () => {
  return (
    <div className="min-h-screen bg-[#FEF7CD] bg-opacity-20">
      <Navbar />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-3.5rem)] w-full">
          <FilterSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-[#8B5CF6] font-['Open_Sans'] mb-8">
                Inspirational Quotes
              </h1>
              <QuotesGrid />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ClientQuotes;