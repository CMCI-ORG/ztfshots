import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RSSFeedContent } from "./RSSFeedContent";

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
        <div 
          key={feed.id} 
          className="space-y-4"
          data-testid="footer-rss-feed"
          data-max-items={feed.feed_count}
        >
          <h4 className="font-semibold">{feed.section_title}</h4>
          <RSSFeedContent url={feed.rss_url} maxItems={feed.feed_count} />
        </div>
      ))}
    </>
  );
};