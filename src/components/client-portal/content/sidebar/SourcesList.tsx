import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Source {
  id: string;
  title: string;
  url?: string;
}

interface SourcesListProps {
  sources: Source[];
}

export const SourcesList = ({ sources }: SourcesListProps) => {
  const { data: sourceQuoteCounts } = useQuery({
    queryKey: ["source-quote-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("source_quote_counts")
        .select("*");

      if (error) throw error;
      return data.reduce((acc: Record<string, number>, curr) => {
        acc[curr.source_id] = parseInt(curr.quote_count.toString());
        return acc;
      }, {});
    },
  });

  // Sort sources by quote count
  const sortedSources = [...sources].sort((a, b) => {
    const countA = sourceQuoteCounts?.[a.id] || 0;
    const countB = sourceQuoteCounts?.[b.id] || 0;
    return countB - countA;
  });

  return (
    <div className="space-y-2">
      {sortedSources.map((source) => (
        <div key={source.id} className="flex items-center gap-2">
          {source.url ? (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-primary transition-colors flex items-center gap-1"
            >
              {source.title}
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-sm">{source.title}</span>
          )}
          {sourceQuoteCounts?.[source.id] && (
            <span className="text-muted-foreground text-sm">
              ({sourceQuoteCounts[source.id]})
            </span>
          )}
        </div>
      ))}
    </div>
  );
};