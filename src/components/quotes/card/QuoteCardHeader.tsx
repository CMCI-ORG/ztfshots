import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface QuoteCardHeaderProps {
  author: string;
  authorId?: string;
  category: string;
  categoryId?: string;
  authorImageUrl?: string | null;
}

export const QuoteCardHeader = ({
  author,
  authorId,
  category,
  categoryId,
  authorImageUrl,
}: QuoteCardHeaderProps) => {
  return (
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
  );
};