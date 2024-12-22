import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DailyQuotePost } from "@/components/quotes/DailyQuotePost";
import { format } from "date-fns";

const Quote = () => {
  const { id } = useParams();

  const { data: quote, isLoading } = useQuery({
    queryKey: ["quote", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name),
          categories:category_id(name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!quote) {
    return <div>Quote not found</div>;
  }

  const formattedDate = format(new Date(quote.created_at), "MMMM d, yyyy");
  const title = `Daily Quote - ${formattedDate}`;
  const reflection = "Take a moment to reflect on this quote and consider how it applies to your life.";

  return (
    <div className="min-h-screen bg-[#FEF7CD] bg-opacity-20 py-8">
      <DailyQuotePost
        id={quote.id}
        title={title}
        quote={quote.text}
        author={quote.authors?.name || "Unknown"}
        reflection={reflection}
      />
    </div>
  );
};

export default Quote;