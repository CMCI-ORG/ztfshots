import { QuoteFilters } from "../SearchFilterPanel";
import { QuotesPagination } from "./QuotesPagination";
import { useQuotesQuery } from "./hooks/useQuotesQuery";
import { SearchMessage } from "./SearchMessage";
import { QuoteGridDisplay } from "./QuoteGridDisplay";
import { LoadingGrid } from "./LoadingGrid";
import { ErrorAlert } from "./ErrorAlert";
import { EmptyQuotesAlert } from "./EmptyQuotesAlert";

export interface QuotesGridProps {
  quotes?: any[];
  isLoading?: boolean;
  filters?: QuoteFilters;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  showScheduled?: boolean;
  authorId?: string;
  categoryId?: string;
  columnCount?: 'two' | 'three' | 'four';
}

export const QuotesGrid = ({ 
  quotes: propQuotes, 
  isLoading: propIsLoading, 
  filters,
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 12,
  onPageChange,
  showScheduled = false,
  authorId,
  categoryId,
  columnCount = 'four'
}: QuotesGridProps) => {
  const { data: fetchedQuotes, isLoading: isFetching, error } = useQuotesQuery(
    {
      ...filters,
      authorId: authorId || filters?.authorId,
      categoryId: categoryId || filters?.categoryId
    },
    currentPage,
    itemsPerPage,
    showScheduled
  );

  const quotes = propQuotes || fetchedQuotes?.data;
  const isLoading = propIsLoading || isFetching;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
        totalQuotes={totalItems} 
        filters={filters} 
        quotes={quotes}
      />

      <QuoteGridDisplay quotes={quotes} columnCount={columnCount} />

      {onPageChange && totalPages > 1 && (
        <QuotesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};