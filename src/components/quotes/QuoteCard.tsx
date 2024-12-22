import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { ShareableQuoteDialog } from "./ShareableQuoteDialog";
import { LikeButton } from "./interactions/LikeButton";
import { StarButton } from "./interactions/StarButton";
import { ShareButton } from "./interactions/ShareButton";
import { Button } from "@/components/ui/button";

interface QuoteCardProps {
  id?: string;
  quote: string;
  author: string;
  category: string;
  date: string;
  sourceTitle?: string;
  sourceUrl?: string;
  hashtags?: string[];
}

export const QuoteCard = ({ 
  id,
  quote, 
  author, 
  category, 
  date,
  sourceTitle,
  sourceUrl,
  hashtags = []
}: QuoteCardProps) => {
  return (
    <Card className="h-full bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="text-sm text-muted-foreground font-['Roboto'] p-4">
        <div className="flex items-center justify-between">
          <span className="bg-[#E5DEFF] text-[#8B5CF6] px-2 py-0.5 rounded-full text-xs font-medium">
            {category}
          </span>
          <span className="text-xs">{date}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4">
        <Link to={id ? `/quote/${id}` : "#"} className="block">
          <blockquote className="text-lg font-['Open_Sans'] font-bold leading-relaxed text-gray-800 hover:text-[#8B5CF6] transition-colors">
            "{quote}"
          </blockquote>
        </Link>
        <p className="mt-2 text-sm font-medium italic text-[#8B5CF6]">— {author}</p>
        {sourceTitle && (
          <p className="text-xs text-muted-foreground font-['Roboto']">
            From{" "}
            {sourceUrl ? (
              <a 
                href={sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#8B5CF6] hover:underline inline-flex items-center gap-1"
              >
                {sourceTitle}
              </a>
            ) : (
              sourceTitle
            )}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {hashtags.map((tag) => (
            <span 
              key={tag} 
              className="text-xs text-[#8B5CF6] bg-[#E5DEFF] px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-gray-100 p-2">
        <div className="flex gap-1">
          {id && (
            <>
              <LikeButton quoteId={id} />
              <StarButton quoteId={id} />
              <Link to={`/quote/${id}#comments`}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="px-2 text-gray-600 hover:text-[#8B5CF6]"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="ml-1 text-xs">0</span>
                </Button>
              </Link>
            </>
          )}
        </div>
        {id && (
          <div className="flex gap-1">
            <ShareableQuoteDialog 
              quote={quote}
              author={author}
              sourceTitle={sourceTitle}
              onDownload={() => {
                supabase
                  .from('quote_downloads')
                  .insert({ quote_id: id })
                  .then(() => {})
                  .catch(console.error);
              }}
              onShare={() => {
                supabase
                  .from('quote_shares')
                  .insert({ 
                    quote_id: id,
                    share_type: 'dialog'
                  })
                  .then(() => {})
                  .catch(console.error);
              }}
            />
            <ShareButton 
              quoteId={id}
              onShare={() => {}}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};