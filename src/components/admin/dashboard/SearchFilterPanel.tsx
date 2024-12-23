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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
        toast({
          title: "Error loading authors",
          description: "Please try again later",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
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
        toast({
          title: "Error loading categories",
          description: "Please try again later",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
  });

  const renderSelect = (
    placeholder: string,
    items: any[] | undefined,
    isLoading: boolean,
    valueKey: string = "id",
    labelKey: string = "name"
  ) => {
    if (isLoading) {
      return <Skeleton className="h-10 w-full" />;
    }

    return (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items?.map((item) => (
            <SelectItem key={item[valueKey]} value={item[valueKey]}>
              {item[labelKey]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="container mx-auto px-4 mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Input
              placeholder="Search for a quote or topic..."
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          
          {renderSelect("Select Author", authors, isLoadingAuthors)}
          {renderSelect("Select Category", categories, isLoadingCategories)}

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={String(i + 1)}>
                  {format(new Date(2024, i, 1), "MMMM")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};