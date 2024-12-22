import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { format } from "date-fns";

interface QuotesGridProps {
  quotes?: any[];
  isLoading?: boolean;
}

export const QuotesGrid = ({ quotes: propQuotes, isLoading: propIsLoading }: QuotesGridProps) => {
  const { data: fetchedQuotes, isLoading: isFetching } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name, image_url),
          categories:category_id(name)
        `)
        .order("post_date", { ascending: false });

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