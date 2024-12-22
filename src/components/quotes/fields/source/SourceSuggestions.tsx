import { ScrollArea } from "@/components/ui/scroll-area";
import { Source } from "./types";

interface SourceSuggestionsProps {
  sources: Source[];
  isVisible: boolean;
  onSelect: (source: Source) => void;
}

export function SourceSuggestions({ sources, isVisible, onSelect }: SourceSuggestionsProps) {
  if (!isVisible || !sources.length) return null;

  return (
    <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
      <ScrollArea className="h-[200px]">
        <div className="p-2">
          {sources.map((source) => (
            <div
              key={source.id}
              className="flex flex-col gap-1 p-2 hover:bg-accent rounded-sm cursor-pointer"
              onClick={() => onSelect(source)}
            >
              <span className="font-medium">{source.title}</span>
              {source.url && (
                <span className="text-sm text-muted-foreground truncate">
                  {source.url}
                </span>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}