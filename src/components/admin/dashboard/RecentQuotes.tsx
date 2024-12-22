import { QuoteCard } from "@/components/quotes/QuoteCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const RecentQuotes = () => {
  const { data: recentQuotes } = useQuery({
    queryKey: ["recent-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name),
          categories:category_id(name)
        `)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto px-4 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-[#8B5CF6] font-['Open_Sans']">
        Recent Quotes
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {recentQuotes?.map((quote) => (
          <div
            key={quote.id}
            className="transform transition-transform hover:-translate-y-1"
          >
            <QuoteCard
              quote={quote.text}
              author={quote.authors?.name || "Unknown"}
              category={quote.categories?.name || "Uncategorized"}
              date={format(new Date(quote.created_at), "yyyy-MM-dd")}
              sourceTitle={quote.source_title}
              sourceUrl={quote.source_url}
            />
          </div>
        ))}
      </div>
    </div>
  );
};