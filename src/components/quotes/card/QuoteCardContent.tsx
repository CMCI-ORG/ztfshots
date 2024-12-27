import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

interface QuoteCardContentProps {
  quote: string;
  title?: string;
  sourceTitle?: string;
  sourceUrl?: string;
  author: string;
  authorId?: string;
  authorImageUrl?: string | null;
}

export const QuoteCardContent = ({
  quote,
  title,
  sourceTitle,
  sourceUrl,
  author,
  authorId,
  authorImageUrl,
}: QuoteCardContentProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full border-4 border-white/50 shadow-lg overflow-hidden">
          <Avatar className="w-full h-full">
            <AvatarImage src={authorImageUrl || undefined} alt={author} className="object-cover" />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {title && (
        <h4 className="font-bold text-lg text-[#2B4C7E] text-center">{title}</h4>
      )}
      <div className="relative">
        <span className="absolute -top-4 -left-2 text-4xl text-[#33A1DE] opacity-20 font-serif leading-none">"</span>
        <div className="pl-4 pr-2 italic text-[#2B4C7E] leading-relaxed text-center">
          {quote}
        </div>
        <span className="absolute -bottom-2 right-0 text-4xl text-[#33A1DE] opacity-20 font-serif leading-none rotate-180">"</span>
      </div>
      <div className="space-y-2">
        {sourceTitle && (
          <div className="text-sm text-[#33A1DE] text-center">
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
        <div className="text-center">
          <Link 
            to={authorId ? `/authors/${authorId}` : '#'} 
            className="text-lg font-semibold text-[#2B4C7E] hover:text-[#33A1DE] transition-colors"
          >
            {author}
          </Link>
        </div>
      </div>
    </div>
  );
};