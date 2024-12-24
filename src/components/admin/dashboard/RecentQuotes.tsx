import { QuoteCard } from "@/components/quotes/QuoteCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const RecentQuotes = () => {
  const { data: recentQuotes, isLoading } = useQuery({
    queryKey: ["recent-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name, image_url),
          categories:category_id(name)
        `)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      console.log('Recent quotes data:', data); // Debug log
      return data;
    },
  });

  return (
    <div className="container mx-auto px-4 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-[#8B5CF6] font-['Open_Sans'] animate-fade-in">
        Recent Quotes
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </Card>
            ))}
          </>
        ) : (
          recentQuotes?.map((quote, index) => (
            <div
              key={quote.id}
              className="transform transition-all duration-500 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <QuoteCard
                id={quote.id}
                quote={quote.text}
                author={quote.authors?.name || "Unknown"}
                authorImageUrl={quote.authors?.image_url}
                category={quote.categories?.name || "Uncategorized"}
                date={format(new Date(quote.created_at), "yyyy-MM-dd")}
                sourceTitle={quote.source_title}
                sourceUrl={quote.source_url}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};