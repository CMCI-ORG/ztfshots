import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Author {
  id: string;
  name: string;
  image_url?: string;
}

interface AuthorsGridProps {
  authors: Author[];
}

export const AuthorsGrid = ({ authors }: AuthorsGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {authors.map((author) => (
        <div key={author.id} className="text-center">
          <Avatar className="mx-auto mb-2">
            <AvatarImage src={author.image_url} alt={author.name} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{author.name}</span>
        </div>
      ))}
    </div>
  );
};