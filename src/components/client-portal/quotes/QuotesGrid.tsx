import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { format } from "date-fns";
import { QuoteFilters } from "../SearchFilterPanel";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

interface QuotesGridProps {
  quotes?: any[];
  isLoading?: boolean;
  filters?: QuoteFilters;
  itemsPerPage?: number;
}

export const QuotesGrid = ({ 
  quotes: propQuotes, 
  isLoading: propIsLoading, 
  filters,
  itemsPerPage = 12 
}: QuotesGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: fetchedQuotes, isLoading: isFetching } = useQuery({
    queryKey: ["quotes", filters, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name, image_url),
          categories:category_id(name)
        `, { count: 'exact' })
        .order("post_date", { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (filters?.authorId && filters.authorId !== "all") {
        query = query.eq("author_id", filters.authorId);
      }

      if (filters?.categoryId && filters.categoryId !== "all") {
        query = query.eq("category_id", filters.categoryId);
      }

      if (filters?.month && filters.month !== "all") {
        query = query.eq("date_part('month', post_date::date)", filters.month);
      }

      if (filters?.search) {
        query = query.or(`text.ilike.%${filters.search}%,categories.name.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { data, count };
    },
    enabled: !propQuotes,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });

  const quotes = propQuotes || fetchedQuotes?.data;
  const totalQuotes = fetchedQuotes?.count || 0;
  const isLoading = propIsLoading || isFetching;
  const totalPages = Math.ceil(totalQuotes / itemsPerPage);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    // Always show first page
    items.push(
      <PaginationItem key="1">
        <PaginationLink
          onClick={() => setCurrentPage(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

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
              hashtags={["ZTFBooks", quote.categories?.name?.replace(/\s+/g, '') || "Quotes"]}
            />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};