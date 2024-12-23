import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useEngagementQueries = () => {
  const { toast } = useToast();

  const userGrowthQuery = useQuery({
    queryKey: ["user-growth"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("created_at")
        .order("created_at");

      if (error) {
        console.error("Error fetching user growth:", error);
        throw error;
      }

      if (!data) return [];

      return data.reduce((acc: any[], profile) => {
        const month = new Date(profile.created_at).toLocaleString('default', { month: 'short' });
        const existingMonth = acc.find(item => item.month === month);
        
        if (existingMonth) {
          existingMonth.users += 1;
        } else {
          acc.push({ month, users: 1 });
        }
        
        return acc;
      }, []);
    },
    meta: {
      errorHandler: (error: Error) => {
        console.error("Query error:", error);
        toast({
          title: "Error loading user growth data",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    }
  });

  const categoryEngagementQuery = useQuery({
    queryKey: ["category-engagement"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          categories:category_id(name),
          quote_likes(count)
        `);

      if (error) {
        console.error("Error fetching category engagement:", error);
        throw error;
      }

      if (!data) return [];

      return data.reduce((acc: any[], quote) => {
        const category = quote.categories?.name;
        const existingCategory = acc.find(item => item.category === category);
        
        if (existingCategory) {
          existingCategory.engagement += quote.quote_likes.length;
        } else if (category) {
          acc.push({ category, engagement: quote.quote_likes.length });
        }
        
        return acc;
      }, []);
    },
    meta: {
      errorHandler: (error: Error) => {
        console.error("Query error:", error);
        toast({
          title: "Error loading engagement data",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    }
  });

  return {
    userGrowthQuery,
    categoryEngagementQuery,
  };
};