import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QuoteInteractions } from "./interactions/QuoteInteractions";
import { QuoteCardHeader } from "./card/QuoteCardHeader";
import { QuoteCardContent } from "./card/QuoteCardContent";

interface QuoteCardProps {
  id?: string;
  quote: string;
  author: string;
  authorId?: string;
  category: string;
  categoryId?: string;
  date: string;
  sourceTitle?: string;
  sourceUrl?: string;
  hashtags?: string[];
  isLoading?: boolean;
  authorImageUrl?: string | null;
  title?: string;
}

export function QuoteCard({
  id,
  quote,
  author,
  authorId,
  category,
  categoryId,
  date,
  sourceTitle,
  sourceUrl,
  hashtags = [],
  isLoading = false,
  authorImageUrl,
  title,
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
    <Card className="h-full flex flex-col bg-gradient-to-br from-[#EDF4FF] to-white">
      <CardHeader>
        <QuoteCardHeader
          author={author}
          authorId={authorId}
          category={category}
          categoryId={categoryId}
          authorImageUrl={authorImageUrl}
        />
      </CardHeader>
      <CardContent className="flex-1">
        <QuoteCardContent
          quote={quote}
          title={title}
          sourceTitle={sourceTitle}
          sourceUrl={sourceUrl}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-sm text-[#5A7BA6] w-full">
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