import { Badge } from "@/components/ui/badge";

interface QuoteContentProps {
  title?: string;
  text: string;
  translations?: Record<string, { text: string; title?: string }>;
}

export const QuoteContent = ({ title, text, translations }: QuoteContentProps) => {
  return (
    <div className="max-w-xl space-y-1">
      {title && (
        <div className="font-semibold text-primary">{title}</div>
      )}
      <div className="text-sm text-muted-foreground line-clamp-2">
        {text}
      </div>
      {translations && Object.keys(translations).length > 0 && (
        <div className="flex gap-1 mt-1">
          {Object.keys(translations).map((langCode) => (
            <Badge key={langCode} variant="secondary" className="text-xs">
              {langCode.toUpperCase()}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};