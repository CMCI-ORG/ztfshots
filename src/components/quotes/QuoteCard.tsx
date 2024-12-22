import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, ExternalLink } from "lucide-react";

interface QuoteCardProps {
  quote: string;
  author: string;
  category: string;
  date: string;
  sourceTitle?: string;
  sourceUrl?: string;
}

export const QuoteCard = ({ 
  quote, 
  author, 
  category, 
  date,
  sourceTitle,
  sourceUrl 
}: QuoteCardProps) => {
  return (
    <Card className="h-full bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="text-sm text-muted-foreground font-['Roboto']">
        <div className="flex items-center justify-between">
          <span className="bg-[#E5DEFF] text-[#8B5CF6] px-3 py-1 rounded-full text-xs font-medium">
            {category}
          </span>
          <span className="text-xs">{date}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <blockquote className="text-xl font-['Open_Sans'] italic leading-relaxed text-gray-800">
          "{quote}"
        </blockquote>
        <p className="mt-4 text-sm font-medium text-[#8B5CF6]">— {author}</p>
        {sourceTitle && (
          <p className="text-sm text-muted-foreground font-['Roboto']">
            From{" "}
            {sourceUrl ? (
              <a 
                href={sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#8B5CF6] hover:underline inline-flex items-center gap-1"
              >
                {sourceTitle}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              sourceTitle
            )}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t border-gray-100 pt-4">
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#8B5CF6]">
          <Heart className="mr-2 h-4 w-4" />
          Like
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#8B5CF6]">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};