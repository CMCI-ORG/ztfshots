import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

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
        <Link 
          key={author.id} 
          to={`/authors/${author.id}`}
          className="text-center group"
        >
          <Avatar className="mx-auto mb-2">
            <AvatarImage src={author.image_url} alt={author.name} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm group-hover:text-primary transition-colors">
            {author.name}
          </span>
        </Link>
      ))}
    </div>
  );
};