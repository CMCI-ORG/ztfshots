import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TimeRangeFilter, TimeRange } from "@/components/admin/dashboard/filters/TimeRangeFilter";

export type QuoteFilters = {
  search: string;
  authorId: string;
  categoryId: string;
  timeRange: TimeRange;
};

interface SearchFilterPanelProps {
  filters: QuoteFilters;
  onFiltersChange: (filters: QuoteFilters) => void;
}

export const SearchFilterPanel = ({ filters, onFiltersChange }: SearchFilterPanelProps) => {
  const { data: authors } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Handle individual filter changes
  const handleFilterChange = (key: keyof QuoteFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="container mx-auto px-4 mb-8">
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative col-span-1 lg:col-span-1">
            <Input
              placeholder="Search for a quote or topic..."
              className="pl-10 h-12"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
            <Search className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
          </div>
          
          <Select
            value={filters.authorId}
            onValueChange={(value) => handleFilterChange("authorId", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select Author" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Authors</SelectItem>
              {authors?.map((author) => (
                <SelectItem key={author.id} value={author.id}>
                  {author.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.categoryId}
            onValueChange={(value) => handleFilterChange("categoryId", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <TimeRangeFilter
            value={filters.timeRange}
            onChange={(value) => handleFilterChange("timeRange", value)}
          />
        </div>
      </div>
    </div>
  );
};