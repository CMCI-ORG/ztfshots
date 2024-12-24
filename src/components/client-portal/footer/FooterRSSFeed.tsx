import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Rss } from "lucide-react";

interface FooterRSSFeedProps {
  position: string;
}

export const FooterRSSFeed = ({ position }: FooterRSSFeedProps) => {
  const { data: feeds } = useQuery({
    queryKey: ["footer-feeds", position],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feed_settings")
        .select("*")
        .eq("footer_position", position)
        .order("footer_order", { ascending: true });

      if (error) {
        console.error("Error fetching footer feeds:", error);
        return [];
      }
      return data || [];
    },
  });

  if (!feeds?.length) return null;

  return (
    <>
      {feeds.map((feed) => (
        <div key={feed.id} className="space-y-2">
          <h4 className="font-semibold">{feed.section_title}</h4>
          <Link 
            to={feed.rss_url} 
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-[#8B5CF6]"
          >
            <Rss className="h-4 w-4" />
            <span>RSS Feed</span>
          </Link>
        </div>
      ))}
    </>
  );
};