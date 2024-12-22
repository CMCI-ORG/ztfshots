import { QuoteCard } from "@/components/quotes/QuoteCard";
import { format } from "date-fns";

interface Quote {
  id: string;
  text: string;
  authors: { name: string };
  categories: { name: string };
  post_date: string;
  source_title?: string;
  source_url?: string;
}

interface QuotesGridProps {
  quotes?: Quote[];
  isLoading?: boolean;
}

export const QuotesGrid = ({ quotes, isLoading }: QuotesGridProps) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!quotes?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No quotes found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {quotes.map((quote) => (
        <div key={quote.id} className="transform transition-transform hover:-translate-y-1">
          <QuoteCard
            id={quote.id}
            quote={quote.text}
            author={quote.authors?.name || "Unknown"}
            category={quote.categories?.name || "Uncategorized"}
            date={format(new Date(quote.post_date), "MMMM d, yyyy")}
            sourceTitle={quote.source_title}
            sourceUrl={quote.source_url}
            hashtags={["ZTFBooks", quote.categories?.name?.replace(/\s+/g, '') || "Quotes"]}
          />
        </div>
      ))}
    </div>
  );
};