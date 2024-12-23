/**
 * SearchFilterPanel Component
 * 
 * Provides a comprehensive search and filtering interface for the admin dashboard.
 * Includes filters for authors, categories, dates, and text search.
 * 
 * @component
 * @example
 * ```tsx
 * <SearchFilterPanel />
 * ```
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SearchInput } from "./filters/SearchInput";
import { FilterSelect } from "./filters/FilterSelect";
import { DateFilters } from "./filters/DateFilters";

export const SearchFilterPanel = () => {
  const { toast } = useToast();

  const { data: authors, isLoading: isLoadingAuthors } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("id, name")
        .order("name");
      
      if (error) {
        console.error("Error fetching authors:", error);
        throw error;
      }
      return data;
    },
    meta: {
      errorHandler: (error: Error) => {
        console.error("Query error:", error);
        toast({
          title: "Error loading authors",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    }
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");
      
      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      return data;
    },
    meta: {
      errorHandler: (error: Error) => {
        console.error("Query error:", error);
        toast({
          title: "Error loading categories",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    }
  });

  return (
    <div className="container mx-auto px-4 mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <SearchInput />
          <FilterSelect
            placeholder="Select Author"
            items={authors}
            isLoading={isLoadingAuthors}
          />
          <FilterSelect
            placeholder="Select Category"
            items={categories}
            isLoading={isLoadingCategories}
          />
          <DateFilters />
        </div>
      </div>
    </div>
  );
};