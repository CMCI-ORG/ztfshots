import { useEffect, useState } from "react";

interface FeedItem {
  title: string;
  link: string;
  pubDate?: string;
}

interface RSSFeedContentProps {
  url: string;
  maxItems?: number;
}

export const RSSFeedContent = ({ url, maxItems = 5 }: RSSFeedContentProps) => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFeed = async () => {
      if (!url) {
        console.log("No URL provided for RSS feed");
        return;
      }

      setIsLoading(true);
      console.log("Fetching RSS feed from URL:", url);

      try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (!data?.contents) {
          console.error("No contents in RSS feed response");
          throw new Error('Failed to fetch feed contents');
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
        
        if (!xmlDoc) {
          throw new Error('Failed to parse XML');
        }

        // Handle both RSS and Atom feeds
        const entries = Array.from(xmlDoc.querySelectorAll('item, entry'));
        console.log("Found feed entries:", entries.length);
        
        const feedItems = entries.slice(0, maxItems).map(item => ({
          title: item.querySelector('title')?.textContent || 'Untitled',
          link: item.querySelector('link')?.textContent || 
                item.querySelector('link')?.getAttribute('href') || '#',
          pubDate: item.querySelector('pubDate, published')?.textContent || undefined
        }));

        console.log("Processed feed items:", feedItems);
        setItems(feedItems);
        setError(null);
      } catch (err) {
        console.error("Error fetching RSS feed:", err);
        setError('Failed to load feed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [url, maxItems]);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading feed...</div>;
  }

  if (error) {
    console.error("RSS feed error:", error);
    return <p className="text-sm text-red-500" data-testid="feed-error">{error}</p>;
  }

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">No items found</p>;
  }

  return (
    <ul className="space-y-2" data-testid="feed-items">
      {items.map((item, index) => (
        <li key={`${item.link}-${index}`} className="text-sm">
          <a 
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-muted-foreground hover:text-foreground transition-colors"
          >
            {item.title}
          </a>
          {item.pubDate && (
            <span className="text-xs text-muted-foreground ml-2">
              {new Date(item.pubDate).toLocaleDateString()}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};