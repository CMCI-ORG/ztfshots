import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface QuoteSourceProps {
  sourceTitle?: string;
  sourceUrl?: string;
}

export const QuoteSource = ({ sourceTitle, sourceUrl }: QuoteSourceProps) => {
  if (!sourceTitle) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground truncate max-w-[150px]">
        {sourceTitle}
      </span>
      {sourceUrl && (
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      )}
    </div>
  );
};