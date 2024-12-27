import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QuoteInteractions } from "./interactions/QuoteInteractions";
import { QuoteCardHeader } from "./card/QuoteCardHeader";
import { QuoteCardContent } from "./card/QuoteCardContent";
import { useLanguage } from "@/providers/LanguageProvider";

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
  translations?: Record<string, any>;
  primaryLanguage?: string;
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
  translations = {},
  primaryLanguage = 'en',
}: QuoteCardProps) {
  const { currentLanguage } = useLanguage();

  if (isLoading) {
    return (
      <Card>
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

  // Get translated content
  const translatedQuote = currentLanguage !== primaryLanguage ? 
    translations?.[currentLanguage]?.text || quote : 
    quote;

  const translatedTitle = currentLanguage !== primaryLanguage ? 
    translations?.[currentLanguage]?.title || title : 
    title;

  const translatedSourceTitle = currentLanguage !== primaryLanguage ? 
    translations?.[currentLanguage]?.source_title || sourceTitle : 
    sourceTitle;

  const translatedSourceUrl = currentLanguage !== primaryLanguage ? 
    translations?.[currentLanguage]?.source_url || sourceUrl : 
    sourceUrl;

  return (
    <Card className="bg-gradient-to-br from-[#EDF4FF] to-white">
      <CardHeader>
        <QuoteCardHeader
          author={author}
          authorId={authorId}
          category={category}
          categoryId={categoryId}
        />
      </CardHeader>
      <CardContent>
        <QuoteCardContent
          quote={translatedQuote}
          title={translatedTitle}
          sourceTitle={translatedSourceTitle}
          sourceUrl={translatedSourceUrl}
          author={author}
          authorImageUrl={authorImageUrl}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-sm text-[#5A7BA6] w-full">
          {format(new Date(date), 'MMM d, yyyy')}
        </div>
        {id && (
          <QuoteInteractions 
            quoteId={id}
            quote={translatedQuote}
            author={author}
            showComments={false}
          />
        )}
      </CardFooter>
    </Card>
  );
}