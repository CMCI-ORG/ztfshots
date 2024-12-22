import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { QuoteInteractions } from "./interactions/QuoteInteractions";
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
  authorImageUrl?: string | null;
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
  authorImageUrl,
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
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 mt-1">
            <AvatarImage src={authorImageUrl || undefined} alt={author} />
            <AvatarFallback>{author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{author}</h3>
            <div className="text-sm text-muted-foreground">{category}</div>
          </div>
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
      <CardFooter className="flex flex-col gap-4">
        <div className="text-sm text-muted-foreground w-full">
          {format(new Date(date), 'MMM d, yyyy')}
        </div>
        {id && (
          <QuoteInteractions 
            quoteId={id}
            quote={quote}
            author={author}
            showComments={false}
          />
        )}
      </CardFooter>
    </Card>
  );
}