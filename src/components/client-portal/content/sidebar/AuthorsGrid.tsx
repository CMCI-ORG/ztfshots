import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Author {
  id: string;
  name: string;
  image_url?: string;
  quote_count?: number;
}

interface AuthorsGridProps {
  authors: Author[];
}

export const AuthorsGrid = ({ authors }: AuthorsGridProps) => {
  // Fetch quote counts for authors
  const { data: authorQuoteCounts } = useQuery({
    queryKey: ["author-quote-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("author_quote_counts")
        .select("*");

      if (error) throw error;
      return data.reduce((acc: Record<string, number>, curr) => {
        acc[curr.author_id] = parseInt(curr.quote_count);
        return acc;
      }, {});
    },
  });

  // Sort authors by quote count
  const sortedAuthors = [...authors].sort((a, b) => {
    const countA = authorQuoteCounts?.[a.id] || 0;
    const countB = authorQuoteCounts?.[b.id] || 0;
    return countB - countA;
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      {sortedAuthors.map((author) => (
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
            {authorQuoteCounts?.[author.id] && (
              <span className="text-muted-foreground ml-1">
                ({authorQuoteCounts[author.id]})
              </span>
            )}
          </span>
        </Link>
      ))}
    </div>
  );
};