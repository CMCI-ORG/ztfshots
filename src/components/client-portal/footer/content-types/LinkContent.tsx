import { ExternalLink } from "lucide-react";

interface LinkContentProps {
  title?: string | null;
  links: Array<{ text: string; url: string }>;
}

export const LinkContent = ({ title, links }: LinkContentProps) => {
  if (!Array.isArray(links)) {
    console.warn('Invalid links structure:', links);
    return null;
  }

  return (
    <div className="space-y-2">
      {title && <h4 className="font-bold text-base text-foreground mb-2">{title}</h4>}
      <div className="flex flex-col space-y-2">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            className="text-sm text-muted-foreground hover:text-[#8B5CF6] transition-colors flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            {link.text}
          </a>
        ))}
      </div>
    </div>
  );
};