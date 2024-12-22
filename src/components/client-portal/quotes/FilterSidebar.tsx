import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeftFromLine, ArrowRightFromLine, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const FilterContent = () => {
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

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Filters</SidebarGroupLabel>
        <SidebarGroupContent className="space-y-4 p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Author</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Author" />
              </SelectTrigger>
              <SelectContent>
                {authors?.map((author) => (
                  <SelectItem key={author.id} value={author.id}>
                    {author.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Month</label>
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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Year</label>
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
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

export const FilterSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-3 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[280px]">
          <FilterContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="relative">
      <Sidebar className={`border-r transition-all duration-300 ${isCollapsed ? 'w-[60px]' : 'w-[240px]'}`}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-2 z-50"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ArrowRightFromLine className="h-4 w-4" />
          ) : (
            <ArrowLeftFromLine className="h-4 w-4" />
          )}
        </Button>
        {!isCollapsed && <FilterContent />}
      </Sidebar>
    </div>
  );
};