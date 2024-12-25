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

export function RSSFeedContent({ url, maxItems = 5 }: RSSFeedContentProps) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      console.log("Fetching RSS feed from URL:", url);
      try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        if (!data.contents) {
          console.error("No contents in RSS feed response");
          throw new Error('Failed to fetch feed');
        }

        // Parse the XML content
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        
        // Handle both RSS and Atom feeds
        const entries = Array.from(xmlDoc.querySelectorAll('item, entry'));
        console.log("Found feed entries:", entries.length);
        
        const feedItems = entries.slice(0, maxItems).map(item => ({
          title: item.querySelector('title')?.textContent || 'Untitled',
          link: item.querySelector('link')?.textContent || 
                item.querySelector('link')?.getAttribute('href') || '#',
          pubDate: item.querySelector('pubDate, published')?.textContent
        }));

        console.log("Processed feed items:", feedItems);
        setItems(feedItems);
        setError(null);
      } catch (err) {
        console.error('Error fetching RSS feed:', err);
        setError('Failed to load feed content');
      }
    };

    if (url) {
      fetchFeed();
    } else {
      console.log("No URL provided for RSS feed");
    }
  }, [url, maxItems]);

  if (error) {
    console.log("RSS feed error:", error);
    return <p className="text-sm text-red-500" data-testid="feed-error">{error}</p>;
  }

  return (
    <ul className="space-y-2" data-testid="feed-items">
      {items.map((item, index) => (
        <li key={index} className="text-sm">
          <a 
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            data-testid="feed-item-link"
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
}