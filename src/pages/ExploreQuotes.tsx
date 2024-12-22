import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SearchFilterPanel } from "@/components/admin/dashboard/SearchFilterPanel";
import { QuotesGrid } from "@/components/client-portal/quotes/QuotesGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function ExploreQuotes() {
  const [activeTab, setActiveTab] = useState("all");

  const { data: quotes } = useQuery({
    queryKey: ["quotes", activeTab],
    queryFn: async () => {
      let query = supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name),
          categories:category_id(name),
          quote_likes(count),
          quote_stars(count)
        `)
        .eq('status', 'live');

      switch (activeTab) {
        case "highly-rated":
          // Fetch quotes with the most stars and likes
          query = query.order('quote_stars.count', { ascending: false });
          break;
        case "recent":
          // Fetch the most recent quotes
          query = query.order('post_date', { ascending: false });
          break;
        case "featured":
          // You might want to add a 'featured' column to your quotes table
          // For now, we'll just show the most recent ones
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('post_date', { ascending: false });
      }

      const { data, error } = await query.limit(12);
      if (error) throw error;
      return data;
    },
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl font-bold text-[#8B5CF6]">
            Find Inspiration Today
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our extensive collection of quotes by Prof. Z.T. Fomum, designed to inspire, 
            challenge, and equip you for a life of faith.
          </p>
        </div>

        <SearchFilterPanel />

        <div className="my-8">
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="highly-rated">Highly Rated</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <QuotesGrid quotes={quotes} />
            </TabsContent>
            <TabsContent value="highly-rated" className="mt-6">
              <QuotesGrid quotes={quotes} />
            </TabsContent>
            <TabsContent value="recent" className="mt-6">
              <QuotesGrid quotes={quotes} />
            </TabsContent>
            <TabsContent value="featured" className="mt-6">
              <QuotesGrid quotes={quotes} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}