import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";

export const CategoriesList = () => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-2">
      {categories?.map((category) => (
        <div key={category.id} className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <Link 
            to={`/categories/${category.id}`}
            className="text-sm hover:text-primary transition-colors"
          >
            {category.name}
          </Link>
        </div>
      ))}
    </div>
  );
};