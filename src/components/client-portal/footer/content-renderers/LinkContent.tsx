import { Link2 } from "lucide-react";

interface LinkContentProps {
  title?: string;
  url: string;
  text: string;
}

export function LinkContent({ title, url, text }: LinkContentProps) {
  return (
    <div className="space-y-2">
      {title && (
        <h4 className="font-bold text-base text-foreground">{title}</h4>
      )}
      <a 
        href={url} 
        className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Link2 className="h-4 w-4" />
        {text || title}
      </a>
    </div>
  );
}