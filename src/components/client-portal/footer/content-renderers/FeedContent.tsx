import { Rss } from "lucide-react";
import { RSSFeedContent } from "../RSSFeedContent";

interface FeedContentProps {
  title?: string;
  rssUrl: string;
  maxItems?: number;
}

export function FeedContent({ title, rssUrl, maxItems = 5 }: FeedContentProps) {
  return (
    <div className="space-y-4">
      {title && (
        <h4 className="font-bold text-base text-foreground">{title}</h4>
      )}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Rss className="h-4 w-4" />
        <span className="text-sm">RSS Feed</span>
      </div>
      <RSSFeedContent url={rssUrl} maxItems={maxItems} />
    </div>
  );
}