import { QuoteFilters } from "../SearchFilterPanel";
import { QuotesPagination } from "./QuotesPagination";
import { useQuotesQuery } from "./hooks/useQuotesQuery";
import { SearchMessage } from "./SearchMessage";
import { QuoteGridDisplay } from "./QuoteGridDisplay";
import { LoadingGrid } from "./LoadingGrid";
import { ErrorAlert } from "./ErrorAlert";
import { EmptyQuotesAlert } from "./EmptyQuotesAlert";
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

  const quotes = propQuotes || fetchedQuotes?.data;
  const totalQuotes = fetchedQuotes?.count || 0;
  const isLoading = propIsLoading || isFetching;
  const totalPages = Math.ceil(totalQuotes / itemsPerPage);

  console.log('QuotesGrid render:', { quotes, isLoading, error, totalQuotes });

  if (error) {
    return <ErrorAlert error={error} />;
  }

  if (isLoading) {
    return <LoadingGrid itemsPerPage={itemsPerPage} />;
  }

  if (!quotes || quotes.length === 0) {
    return <EmptyQuotesAlert />;
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