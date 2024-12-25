import { MainLayout } from "@/components/layout/MainLayout";
import { SearchFilterPanel, QuoteFilters } from "@/components/client-portal/SearchFilterPanel";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const ClientQuotes = () => {
  const [filters, setFilters] = useState<QuoteFilters>({
    search: "",
    authorId: "all",
    categoryId: "all",
    sourceId: "all",
    timeRange: "lifetime",
  });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

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
          
          <div className="md:hidden mb-4 px-4">
            <Button 
              onClick={toggleFilterPanel}
              variant="outline"
              className="w-full flex items-center justify-between"
            >
              <span>Filters</span>
              {isFilterPanelOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className={cn(
            "transition-all duration-300 ease-in-out",
            {
              "h-0 overflow-hidden md:h-auto": !isFilterPanelOpen,
              "h-auto": isFilterPanelOpen
            }
          )}>
            <SearchFilterPanel 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
          
          <div className="container mx-auto px-4 py-8">
            <QuotesGrid filters={filters} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientQuotes;