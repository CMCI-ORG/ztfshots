import { DailyQuotePost } from "@/components/quotes/DailyQuotePost";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const ClientPortal = () => {
  const { data: quotes, isLoading } = useQuery({
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

  const { data: featuredQuote } = useQuery({
    queryKey: ["featured-quote"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name),
          categories:category_id(name)
        `)
        .eq("status", "live")
        .order("post_date", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-[#FEF7CD] bg-opacity-20">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-[#8B5CF6] font-['Open_Sans']">
            #ZTFBooks Quotes
          </h1>
          <p className="text-muted-foreground mt-2 font-['Roboto']">
            Daily inspiration for your spiritual journey
          </p>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        {featuredQuote && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-[#8B5CF6] font-['Open_Sans'] tracking-tight">
              Today's Featured Quote
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <DailyQuotePost
                title={featuredQuote.categories?.name || "Featured Quote"}
                quote={featuredQuote.text}
                author={featuredQuote.authors?.name || "Unknown"}
                reflection="Take a moment to reflect on this quote and consider how it applies to your life today."
              />
            </div>
          </div>
        )}
        
        <section>
          <h2 className="text-2xl font-bold mb-8 text-[#8B5CF6] font-['Open_Sans'] tracking-tight">
            Recent Quotes
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {quotes?.map((quote) => (
              <div key={quote.id} className="transform transition-transform hover:-translate-y-1">
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
        </section>
      </main>
    </div>
  );
};

export default ClientPortal;