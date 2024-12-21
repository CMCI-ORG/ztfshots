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
    <Card className="h-full">
      <CardHeader className="text-sm text-muted-foreground">
        {category} • {date}
      </CardHeader>
      <CardContent className="space-y-4">
        <blockquote className="text-xl font-serif italic">"{quote}"</blockquote>
        <p className="mt-4 text-sm font-medium">— {author}</p>
        {sourceTitle && (
          <p className="text-sm text-muted-foreground">
            Quote from{" "}
            {sourceUrl ? (
              <a 
                href={sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
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
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm">
          <Heart className="mr-2 h-4 w-4" />
          Like
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};