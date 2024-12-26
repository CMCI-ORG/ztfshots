import { Facebook, Twitter, Instagram, Youtube, Globe } from "lucide-react";

interface SocialContentProps {
  links: Array<{ platform: string; url: string }>;
  title?: string;
}

export function SocialContent({ links, title }: SocialContentProps) {
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-4">
      {title && (
        <h4 className="font-bold text-base text-foreground">{title}</h4>
      )}
      <div className="flex gap-4">
        {links?.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {getSocialIcon(link.platform)}
          </a>
        ))}
      </div>
    </div>
  );
}