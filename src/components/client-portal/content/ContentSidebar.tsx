import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AuthorsList } from "./sidebar/AuthorsList";
import { AuthorsGrid } from "./sidebar/AuthorsGrid";
import { CategoriesList } from "./sidebar/CategoriesList";
import { SourcesList } from "./sidebar/SourcesList";

export const ContentSidebar = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: authors } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Content</h3>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h4 className="font-medium mb-4">Authors</h4>
          {viewMode === "grid" ? (
            <AuthorsGrid authors={authors || []} />
          ) : (
            <AuthorsList authors={authors || []} />
          )}
        </section>

        <section>
          <h4 className="font-medium mb-4">Categories</h4>
          <CategoriesList />
        </section>

        <section>
          <h4 className="font-medium mb-4">Sources</h4>
          <SourcesList />
        </section>
      </div>
    </div>
  );
};