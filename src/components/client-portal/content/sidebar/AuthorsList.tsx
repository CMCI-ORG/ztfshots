import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Author {
  id: string;
  name: string;
  image_url?: string;
}

interface AuthorsListProps {
  authors: Author[];
}

export const AuthorsList = ({ authors }: AuthorsListProps) => {
  return (
    <div className="space-y-2">
      {authors.map((author) => (
        <div key={author.id} className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={author.image_url} alt={author.name} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{author.name}</span>
        </div>
      ))}
    </div>
  );
};