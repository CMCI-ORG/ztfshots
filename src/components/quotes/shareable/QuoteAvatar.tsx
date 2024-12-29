import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface QuoteAvatarProps {
  author: string;
  authorImageUrl?: string;
}

export const QuoteAvatar = ({ author, authorImageUrl }: QuoteAvatarProps) => {
  return (
    <div className="w-24 h-24 rounded-full border-4 border-white/50 shadow-lg overflow-hidden -mt-2">
      <Avatar className="w-full h-full">
        <AvatarImage src={authorImageUrl} alt={author} className="object-cover" />
        <AvatarFallback>
          <User className="h-12 w-12" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};