import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { format } from "date-fns";

const Quote = () => {
  const { id } = useParams();

  const { data: quote, isLoading } = useQuery({
    queryKey: ["quote", id],
    queryFn: async () => {
      if (!id) throw new Error("Quote ID is required");
      
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name),
          categories:category_id(name)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!quote) {
    return <div>Quote not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <QuoteCard
        quote={quote.text}
        author={quote.authors?.name || "Unknown"}
        category={quote.categories?.name || "Uncategorized"}
        date={format(new Date(quote.post_date), "MMMM d, yyyy")}
        sourceTitle={quote.source_title}
        sourceUrl={quote.source_url}
        hashtags={["ZTFBooks", quote.categories?.name?.replace(/\s+/g, '') || "Quotes"]}
      />
    </div>
  );
};

export default Quote;