import { QuoteCard } from "@/components/quotes/QuoteCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { HeroSection } from "@/components/client-portal/HeroSection";
import { QuickLinks } from "@/components/client-portal/QuickLinks";
import { MainLayout } from "@/components/layout/MainLayout";

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

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FEF7CD] bg-opacity-20">
        <main className="flex-1">
          <HeroSection />
          <QuickLinks />
          
          <section className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-8 text-[#8B5CF6] font-['Open_Sans'] tracking-tight">
              Recent Quotes
            </h2>
            <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {quotes?.map((quote) => (
                <div key={quote.id} className="transform transition-transform hover:-translate-y-1">
                  <QuoteCard
                    id={quote.id}
                    quote={quote.text}
                    author={quote.authors?.name || "Unknown"}
                    category={quote.categories?.name || "Uncategorized"}
                    date={format(new Date(quote.created_at), "MMMM d, yyyy")}
                    sourceTitle={quote.source_title}
                    sourceUrl={quote.source_url}
                    hashtags={["ZTFBooks", quote.categories?.name?.replace(/\s+/g, '') || "Quotes"]}
                  />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </MainLayout>
  );
};

export default ClientPortal;