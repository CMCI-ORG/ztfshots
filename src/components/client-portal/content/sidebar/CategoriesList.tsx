import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
}

interface CategoriesListProps {
  categories: Category[];
}

export const CategoriesList = ({ categories }: CategoriesListProps) => {
  const { data: categoryQuoteCounts } = useQuery({
    queryKey: ["category-quote-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category_quote_counts")
        .select("*");

      if (error) throw error;
      return data.reduce((acc: Record<string, number>, curr) => {
        acc[curr.category_id] = parseInt(curr.quote_count);
        return acc;
      }, {});
    },
  });

  // Sort categories by quote count
  const sortedCategories = [...categories].sort((a, b) => {
    const countA = categoryQuoteCounts?.[a.id] || 0;
    const countB = categoryQuoteCounts?.[b.id] || 0;
    return countB - countA;
  });

  return (
    <div className="space-y-2">
      {sortedCategories.map((category) => (
        <Link
          key={category.id}
          to={`/categories/${category.id}`}
          className="block text-sm hover:text-primary transition-colors"
        >
          {category.name}
          {categoryQuoteCounts?.[category.id] && (
            <span className="text-muted-foreground ml-1">
              ({categoryQuoteCounts[category.id]})
            </span>
          )}
        </Link>
      ))}
    </div>
  );
};