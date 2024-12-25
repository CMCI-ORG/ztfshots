import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { QuoteInteractions } from "./interactions/QuoteInteractions";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

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
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 mt-1">
            <AvatarImage src={authorImageUrl || undefined} alt={author} />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <Link 
              to={authorId ? `/authors/${authorId}` : '#'} 
              className="text-lg font-semibold text-[#2B4C7E] hover:text-[#33A1DE] transition-colors"
            >
              {author}
            </Link>
            <Link
              to={categoryId ? `/categories/${categoryId}` : '#'}
              className="text-sm text-[#5A7BA6] hover:text-[#33A1DE] transition-colors"
            >
              {category}
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {title && (
            <h4 className="font-bold text-lg text-[#2B4C7E]">{title}</h4>
          )}
          <div className="relative">
            <span className="absolute -top-6 -left-4 text-6xl text-[#33A1DE] opacity-20 font-serif leading-none">"</span>
            <div className="pl-6 pr-4 italic text-[#2B4C7E] leading-relaxed">
              {quote}
            </div>
            <span className="absolute -bottom-4 right-0 text-4xl text-[#33A1DE] opacity-20 font-serif leading-none rotate-180">"</span>
          </div>
          {sourceTitle && (
            <div className="text-sm text-[#33A1DE] mt-4 font-medium">
              From:{" "}
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2B4C7E] transition-colors underline"
                >
                  {sourceTitle}
                </a>
              ) : (
                <span>{sourceTitle}</span>
              )}
            </div>
          )}
        </div>
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