import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink } from "lucide-react";

export const SourcesList = () => {
  const { data: sources } = useQuery({
    queryKey: ["sources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sources")
        .select("*")
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-2">
      {sources?.map((source) => (
        <div key={source.id} className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{source.title}</span>
        </div>
      ))}
    </div>
  );
};