import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { QuoteStats } from "@/components/analytics/QuoteStats";
import { DailyQuotePost } from "@/components/quotes/DailyQuotePost";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Index = () => {
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Navbar />
          <main className="container mx-auto py-6 px-4">
            {featuredQuote && (
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-6">Today's Featured Quote</h1>
                <DailyQuotePost
                  title={featuredQuote.categories?.name || "Featured Quote"}
                  quote={featuredQuote.text}
                  author={featuredQuote.authors?.name || "Unknown"}
                  reflection="Take a moment to reflect on this quote and consider how it applies to your life today."
                />
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Analytics Overview</h2>
              <QuoteStats />
            </div>
            
            <h2 className="text-2xl font-bold mb-6">Recent Quotes</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quotes?.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote.text}
                  author={quote.authors?.name || "Unknown"}
                  category={quote.categories?.name || "Uncategorized"}
                  date={format(new Date(quote.created_at), "yyyy-MM-dd")}
                  sourceTitle={quote.source_title}
                  sourceUrl={quote.source_url}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;