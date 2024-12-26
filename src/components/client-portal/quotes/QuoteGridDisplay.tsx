import { format } from "date-fns";
import { QuoteCard } from "@/components/quotes/QuoteCard";

interface QuoteGridDisplayProps {
  quotes: any[];
}

export const QuoteGridDisplay = ({ quotes }: QuoteGridDisplayProps) => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-4 md:gap-6">
      {quotes.map((quote) => (
        <div 
          key={quote.id} 
          className="break-inside-avoid mb-4 md:mb-6"
        >
          <QuoteCard
            id={quote.id}
            quote={quote.text}
            author={quote.authors?.name || "Unknown"}
            authorId={quote.author_id}
            category={quote.categories?.name || "Uncategorized"}
            categoryId={quote.category_id}
            date={format(new Date(quote.post_date), "MMMM d, yyyy")}
            sourceTitle={quote.sources?.title}
            sourceUrl={quote.source_url}
            title={quote.title}
            authorImageUrl={quote.authors?.image_url}
            hashtags={["ZTFBooks", quote.categories?.name?.replace(/\s+/g, '') || "Quotes"]}
          />
        </div>
      ))}
    </div>
  );
};