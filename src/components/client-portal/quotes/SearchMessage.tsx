import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { QuoteFilters } from "../SearchFilterPanel";

interface SearchMessageProps {
  totalQuotes: number;
  filters: QuoteFilters | undefined;
  quotes: any[] | undefined;
}

export const SearchMessage = ({ totalQuotes, filters, quotes }: SearchMessageProps) => {
  const getSearchMessage = () => {
    if (!filters) return null;
    
    const conditions = [];
    
    if (filters.search) {
      conditions.push(`containing "${filters.search}"`);
    }
    
    if (filters.authorId && filters.authorId !== "all") {
      const author = quotes?.[0]?.authors?.name;
      if (author) conditions.push(`by ${author}`);
    }
    
    if (filters.categoryId && filters.categoryId !== "all") {
      const category = quotes?.[0]?.categories?.name;
      if (category) conditions.push(`in category "${category}"`);
    }

    if (filters.sourceId && filters.sourceId !== "all") {
      const source = quotes?.[0]?.sources?.title;
      if (source) conditions.push(`from source "${source}"`);
    }
    
    if (filters.timeRange && filters.timeRange !== "lifetime") {
      conditions.push(`from ${filters.timeRange.replace(/_/g, " ")}`);
    }
    
    if (conditions.length === 0) return null;
    
    return `Found ${totalQuotes} quote${totalQuotes !== 1 ? 's' : ''} ${conditions.join(" ")}`;
  };

  const searchMessage = getSearchMessage();

  if (!searchMessage && (!filters?.search || totalQuotes > 0)) return null;

  if (totalQuotes === 0 && filters?.search) {
    return (
      <Alert variant="default" className="bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-700">
          No quotes found matching your search criteria. Try adjusting your filters or search terms.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="default" className="bg-blue-50 border-blue-200">
      <AlertCircle className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-700">
        {searchMessage}
      </AlertDescription>
    </Alert>
  );
};