import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface QuoteCardProps {
  id?: string;
  quote: string;
  author: string;
  category: string;
  date: string;
  sourceTitle?: string;
  sourceUrl?: string;
  hashtags?: string[];
  isLoading?: boolean;
}

export function QuoteCard({
  id,
  quote,
  author,
  category,
  date,
  sourceTitle,
  sourceUrl,
  hashtags = [],
  isLoading = false,
}: QuoteCardProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-8 w-24" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{author}</h3>
          <div className="text-sm text-muted-foreground">{category}</div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="text-base">{quote}</div>
          {sourceTitle && (
            <div className="text-sm text-muted-foreground">
              Source: {sourceUrl ? (
                <a 
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {sourceTitle}
                </a>
              ) : sourceTitle}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {format(new Date(date), 'MMM d, yyyy')}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Star className="h-4 w-4 mr-1" />
            Star
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}