import { format } from "date-fns";
import { QuoteCard } from "@/components/quotes/QuoteCard";

interface QuoteGridDisplayProps {
  quotes: any[];
}

export const QuoteGridDisplay = ({ quotes }: QuoteGridDisplayProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {quotes.map((quote) => (
        <div key={quote.id} className="transform transition-transform hover:-translate-y-1">
          <QuoteCard
            id={quote.id}
            quote={quote.text}
            author={quote.authors?.name || "Unknown"}
            authorImageUrl={quote.authors?.image_url}
            category={quote.categories?.name || "Uncategorized"}
            date={format(new Date(quote.post_date), "MMMM d, yyyy")}
            sourceTitle={quote.sources?.title}
            sourceUrl={quote.source_url}
            title={quote.title}
            hashtags={["ZTFBooks", quote.categories?.name?.replace(/\s+/g, '') || "Quotes"]}
          />
        </div>
      ))}
    </div>
  );
};