import { MainLayout } from "@/components/layout/MainLayout";
import { SearchFilterPanel } from "@/components/client-portal/SearchFilterPanel";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";

const ClientQuotes = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="pt-8 pb-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-['Open_Sans']">
              Explore Quotes
            </h1>
            <p className="text-lg text-gray-600 font-['Roboto']">
              Browse our extensive collection of quotes by Prof. Z.T. Fomum, designed to inspire, challenge, and equip you for a life of faith.
            </p>
          </div>
          
          <SearchFilterPanel />
          
          <div className="container mx-auto px-4 py-8">
            <QuotesGrid />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientQuotes;