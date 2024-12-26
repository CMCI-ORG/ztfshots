import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { FilterSelect } from "./FilterSelect";
import { format } from "date-fns";

export const FilterContent = () => {
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

  const months = Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1),
    name: format(new Date(2024, i, 1), "MMMM"),
  }));

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { id: String(year), name: String(year) };
  });

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Filters</SidebarGroupLabel>
        <SidebarGroupContent className="space-y-4 p-4">
          <FilterSelect
            label="Author"
            placeholder="Select Author"
            options={authors || []}
          />
          <FilterSelect
            label="Category"
            placeholder="Select Category"
            options={categories || []}
          />
          <FilterSelect
            label="Month"
            placeholder="Select Month"
            options={months}
          />
          <FilterSelect
            label="Year"
            placeholder="Select Year"
            options={years}
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};