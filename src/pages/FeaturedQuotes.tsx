import { MainLayout } from "@/components/layout/MainLayout";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FeaturedQuotes = () => {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ["featured-quotes"],
    queryFn: async () => {
      const { data: stars, error: starsError } = await supabase
        .from("quote_stars")
        .select("quote_id, count(*)")
        .group("quote_id")
        .order("count", { ascending: false })
        .limit(20);

      if (starsError) throw starsError;

      const quoteIds = stars.map(star => star.quote_id);

      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name, image_url),
          categories:category_id(name)
        `)
        .in('id', quoteIds)
        .eq('status', 'live');

      if (error) throw error;
      return data;
    },
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-['Open_Sans']">
            Featured Quotes
          </h1>
          <p className="text-lg text-gray-600 font-['Roboto']">
            Explore our handpicked selection of inspiring and transformative quotes.
          </p>
        </div>
        <QuotesGrid quotes={quotes} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
};

export default FeaturedQuotes;