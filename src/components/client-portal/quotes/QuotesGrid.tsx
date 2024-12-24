import { format } from "date-fns";
import { useState } from "react";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { QuoteFilters } from "../SearchFilterPanel";
import { QuotesPagination } from "./QuotesPagination";
import { useQuotesQuery } from "./hooks/useQuotesQuery";

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

  const { data: fetchedQuotes, isLoading: isFetching } = useQuotesQuery(
    filters,
    currentPage,
    itemsPerPage,
    showScheduled
  );

  const quotes = propQuotes || fetchedQuotes?.data;
  const totalQuotes = fetchedQuotes?.count || 0;
  const isLoading = propIsLoading || isFetching;
  const totalPages = Math.ceil(totalQuotes / itemsPerPage);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {quotes?.map((quote) => (
          <div key={quote.id} className="transform transition-transform hover:-translate-y-1">
            <QuoteCard
              id={quote.id}
              quote={quote.text}
              author={quote.authors?.name || "Unknown"}
              authorImageUrl={quote.authors?.image_url}
              category={quote.categories?.name || "Uncategorized"}
              date={format(new Date(quote.post_date), "MMMM d, yyyy")}
              sourceTitle={quote.source_title}
              sourceUrl={quote.source_url}
              title={quote.title}
              hashtags={["ZTFBooks", quote.categories?.name?.replace(/\s+/g, '') || "Quotes"]}
            />
          </div>
        ))}
      </div>

      <QuotesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};