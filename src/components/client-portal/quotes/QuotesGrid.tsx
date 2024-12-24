import { format } from "date-fns";
import { useState } from "react";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { QuoteFilters } from "../SearchFilterPanel";
import { QuotesPagination } from "./QuotesPagination";
import { useQuotesQuery } from "./hooks/useQuotesQuery";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const getSearchMessage = () => {
    if (!filters) return null;
    
    const conditions = [];
    
    if (filters.search) {
      conditions.push(`containing "${filters.search}"`);
    }
    
    if (filters.authorId && filters.authorId !== "all") {
      const author = quotes?.[0]?.authors?.name;
      if (author) conditions.push(`by ${author}`);
    }
    
    if (filters.categoryId && filters.categoryId !== "all") {
      const category = quotes?.[0]?.categories?.name;
      if (category) conditions.push(`in category "${category}"`);
    }
    
    if (filters.timeRange && filters.timeRange !== "lifetime") {
      conditions.push(`from ${filters.timeRange.replace(/_/g, " ")}`);
    }
    
    if (conditions.length === 0) return null;
    
    const message = `Found ${totalQuotes} quote${totalQuotes !== 1 ? 's' : ''} ${conditions.join(" ")}`;
    return message;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const searchMessage = getSearchMessage();

  return (
    <div className="space-y-8">
      {searchMessage && (
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            {searchMessage}
          </AlertDescription>
        </Alert>
      )}

      {totalQuotes === 0 && filters?.search && (
        <Alert variant="default" className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            No quotes found matching your search criteria. Try adjusting your filters or search terms.
          </AlertDescription>
        </Alert>
      )}

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