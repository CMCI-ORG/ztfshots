import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { MainLayout } from "@/components/layout/MainLayout";

const ClientQuotes = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FEF7CD] bg-opacity-20">
        <main className="flex-1">
          <div className="max-w-7xl mx-auto">
            <QuotesGrid />
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default ClientQuotes;