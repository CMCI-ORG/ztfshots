import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchFilterPanel } from "@/components/client-portal/SearchFilterPanel";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ExploreQuotes = () => {
  const { data: featuredQuotes } = useQuery({
    queryKey: ["featured-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name),
          categories:category_id(name),
          quote_likes(count),
          quote_stars(count)
        `)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      return data;
    },
  });

  const { data: highlyRatedQuotes } = useQuery({
    queryKey: ["highly-rated-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name),
          categories:category_id(name),
          quote_likes(count),
          quote_stars(count)
        `)
        .order('quote_likes(count)', { ascending: false })
        .limit(12);

      if (error) throw error;
      return data;
    },
  });

  const { data: recentQuotes } = useQuery({
    queryKey: ["recent-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name),
          categories:category_id(name),
          quote_likes(count),
          quote_stars(count)
        `)
        .order('post_date', { ascending: false })
        .limit(12);

      if (error) throw error;
      return data;
    },
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FEF7CD] bg-opacity-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-[#8B5CF6] mb-4">
              Find Inspiration Today
            </h1>
            <p className="text-lg text-gray-600">
              Browse our extensive collection of quotes by Prof. Z.T. Fomum, 
              designed to inspire, challenge, and equip you for a life of faith.
            </p>
          </div>

          <SearchFilterPanel />

          <div className="mt-8">
            <Tabs defaultValue="featured" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="highly-rated">Highly Rated</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>
              
              <TabsContent value="featured">
                <QuotesGrid quotes={featuredQuotes} />
              </TabsContent>
              
              <TabsContent value="highly-rated">
                <QuotesGrid quotes={highlyRatedQuotes} />
              </TabsContent>
              
              <TabsContent value="recent">
                <QuotesGrid quotes={recentQuotes} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExploreQuotes;