import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { format } from "date-fns";
import { QuoteFilters } from "../SearchFilterPanel";

interface QuotesGridProps {
  quotes?: any[];
  isLoading?: boolean;
  filters?: QuoteFilters;
}

export const QuotesGrid = ({ quotes: propQuotes, isLoading: propIsLoading, filters }: QuotesGridProps) => {
  const { data: fetchedQuotes, isLoading: isFetching } = useQuery({
    queryKey: ["quotes", filters],
    queryFn: async () => {
      let query = supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name, image_url),
          categories:category_id(name)
        `)
        .order("post_date", { ascending: false });

      if (filters?.authorId) {
        query = query.eq("author_id", filters.authorId);
      }

      if (filters?.categoryId) {
        query = query.eq("category_id", filters.categoryId);
      }

      if (filters?.month) {
        query = query.eq("date_part('month', post_date::date)", filters.month);
      }

      if (filters?.search) {
        query = query.ilike("text", `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !propQuotes, // Only fetch if quotes are not provided as props
  });

  const quotes = propQuotes || fetchedQuotes;
  const isLoading = propIsLoading || isFetching;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
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
  );
};