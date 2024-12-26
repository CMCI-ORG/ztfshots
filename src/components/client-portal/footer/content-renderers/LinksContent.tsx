import { Link2 } from "lucide-react";

interface LinksContentProps {
  links: Array<{ text: string; url: string }>;
  title?: string;
}

export function LinksContent({ links, title }: LinksContentProps) {
  return (
    <div className="space-y-4">
      {title && (
        <h4 className="font-bold text-base text-foreground">{title}</h4>
      )}
      <div className="space-y-2">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Link2 className="h-4 w-4" />
            {link.text}
          </a>
        ))}
      </div>
    </div>
  );
}