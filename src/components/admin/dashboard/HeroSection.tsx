import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  const { data: featuredQuote, isLoading } = useQuery({
    queryKey: ["featured-quote"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          authors:author_id(name, image_url),
          categories:category_id(name)
        `)
        .eq("status", "live")
        .order("post_date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="relative bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold text-[#8B5CF6] font-['Open_Sans'] mb-2">
            Quote of the Day
          </h1>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-48 mx-auto" />
              <div className="flex justify-center gap-4 pt-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          ) : (
            featuredQuote && (
              <div className="max-w-3xl mx-auto">
                <QuoteCard
                  id={featuredQuote.id}
                  quote={featuredQuote.text}
                  author={featuredQuote.authors?.name || "Unknown"}
                  authorImageUrl={featuredQuote.authors?.image_url}
                  category={featuredQuote.categories?.name || "Uncategorized"}
                  date={format(new Date(featuredQuote.created_at), "MMMM d, yyyy")}
                  sourceTitle={featuredQuote.source_title}
                  sourceUrl={featuredQuote.source_url}
                />
                <div className="flex justify-center gap-4 mt-6">
                  <Button size="lg" className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
                    Explore Quotes
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate("/subscribe")}
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};