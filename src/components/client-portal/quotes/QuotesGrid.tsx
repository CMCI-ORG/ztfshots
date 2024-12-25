import { QuoteFilters } from "../SearchFilterPanel";
import { QuotesPagination } from "./QuotesPagination";
import { useQuotesQuery } from "./hooks/useQuotesQuery";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchMessage } from "./SearchMessage";
import { QuoteGridDisplay } from "./QuoteGridDisplay";
import { useState } from "react";

interface QuotesGridProps {
  quotes?: any[];
  isLoading?: boolean;
  filters?: QuoteFilters;
  itemsPerPage?: number;
  showScheduled?: boolean;
}

export const QuotesGrid = ({ 
  quotes: propQuotes, 
  isLoading: propIsLoading, 
  filters,
  itemsPerPage = 12,
  showScheduled = false
}: QuotesGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: fetchedQuotes, isLoading: isFetching, error } = useQuotesQuery(
    filters,
    currentPage,
    itemsPerPage,
    showScheduled
  );

  // Use provided quotes if available, otherwise use fetched quotes
  const quotes = propQuotes || fetchedQuotes?.data;
  const totalQuotes = fetchedQuotes?.count || 0;
  const isLoading = propIsLoading || isFetching;
  const totalPages = Math.ceil(totalQuotes / itemsPerPage);

  console.log('QuotesGrid render:', { quotes, isLoading, error, totalQuotes });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load quotes. Please try again later.
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-2 text-xs">{JSON.stringify(error, null, 2)}</pre>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(itemsPerPage)].map((_, i) => (
          <Skeleton key={i} className="h-[400px] w-full" />
        ))}
      </div>
    );
  }

  if (!quotes || quotes.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No quotes found. Try adjusting your filters or check back later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <SearchMessage 
        totalQuotes={totalQuotes} 
        filters={filters} 
        quotes={quotes}
      />

      <QuoteGridDisplay quotes={quotes} />

      <QuotesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};