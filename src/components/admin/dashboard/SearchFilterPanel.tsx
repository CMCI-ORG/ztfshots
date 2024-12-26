import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SearchInput } from "./filters/SearchInput";
import { FilterSelect } from "./filters/FilterSelect";
import { DateFilters } from "./filters/DateFilters";
import { useSearchParams } from "react-router-dom";
import { searchSchema } from "@/utils/validation";
import { useErrorTracking } from "@/utils/errorTracking";

export const SearchFilterPanel = () => {
  const { toast } = useToast();
  const { trackError } = useErrorTracking();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (query: string) => {
    try {
      const validatedSearch = searchSchema.parse({ query });
      setSearchParams(prev => {
        prev.set('q', validatedSearch.query);
        return prev;
      });
    } catch (error) {
      trackError(error as Error);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setSearchParams(prev => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      return prev;
    });
  };

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
        trackError(error);
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
        trackError(error);
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
          <SearchInput 
            defaultValue={searchParams.get('q') || ''}
            onSearch={handleSearch}
          />
          <FilterSelect
            placeholder="Select Author"
            items={authors}
            isLoading={isLoadingAuthors}
            value={searchParams.get('author') || ''}
            onChange={(value) => handleFilterChange('author', value)}
          />
          <FilterSelect
            placeholder="Select Category"
            items={categories}
            isLoading={isLoadingCategories}
            value={searchParams.get('category') || ''}
            onChange={(value) => handleFilterChange('category', value)}
          />
          <DateFilters 
            startDate={searchParams.get('startDate') || ''}
            endDate={searchParams.get('endDate') || ''}
            onDateChange={(start, end) => {
              if (start) handleFilterChange('startDate', start);
              if (end) handleFilterChange('endDate', end);
            }}
          />
        </div>
      </div>
    </div>
  );
};