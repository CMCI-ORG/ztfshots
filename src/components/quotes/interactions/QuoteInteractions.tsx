import { LikeButton } from "./buttons/LikeButton";
import { StarButton } from "./buttons/StarButton";
import { ShareButton } from "./buttons/ShareButton";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

interface QuoteInteractionsProps {
  quoteId?: string;
  quote: string;
  author: string;
  showComments?: boolean;
}

export const QuoteInteractions = ({ 
  quoteId, 
  quote, 
  author,
  showComments = true 
}: QuoteInteractionsProps) => {
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <LikeButton quoteId={quoteId} />
        <StarButton quoteId={quoteId} />
        {showComments && user && quoteId && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 hover:text-[#8B5CF6]"
            asChild
          >
            <Link to={`/quote/${quoteId}#comments`}>
              <MessageCircle className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        {quoteId && (
          <ShareButton 
            quoteId={quoteId}
            quote={quote}
            author={author}
          />
        )}
      </div>
    </div>
  );
};