import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const HeroSection = () => {
  const { data: featuredQuote, isLoading } = useQuery({
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
            <>
              <div className="space-y-4">
                <Skeleton className="h-24 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-48 mx-auto" />
                <div className="flex justify-center gap-4 pt-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </>
          ) : (
            featuredQuote && (
              <>
                <blockquote className="text-2xl font-serif italic text-gray-800">
                  "{featuredQuote.text}"
                </blockquote>
                <p className="text-lg text-[#8B5CF6]">
                  — {featuredQuote.authors?.name}
                </p>
                <div className="flex justify-center gap-4 pt-4">
                  <Button size="lg" className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
                    Explore Quotes
                  </Button>
                  <Button size="lg" variant="outline">
                    Subscribe
                  </Button>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};