import { Facebook, Twitter, Instagram, Youtube, Globe } from "lucide-react";
import { FooterContent, FooterContentType } from "@/components/admin/settings/footer/types";

interface FooterContentRendererProps {
  content: FooterContent;
  contentType: FooterContentType;
}

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

export function FooterContentRenderer({ content, contentType }: FooterContentRendererProps) {
  switch (contentType.type) {
    case 'text':
      return (
        <div className="text-sm text-muted-foreground">
          {content.title && <h4 className="font-semibold mb-2">{content.title}</h4>}
          <p>{content.content.text}</p>
        </div>
      );
    case 'link':
      return (
        <div>
          <a 
            href={content.content.url} 
            className="text-sm text-muted-foreground hover:text-[#8B5CF6]"
            target="_blank"
            rel="noopener noreferrer"
          >
            {content.title || content.content.text}
          </a>
        </div>
      );
    case 'links':
      return (
        <div className="space-y-2">
          {content.title && <h4 className="font-semibold text-sm mb-2">{content.title}</h4>}
          <div className="flex flex-col space-y-2">
            {content.content.links?.map((link: { text: string; url: string }, index: number) => (
              <a
                key={index}
                href={link.url}
                className="text-sm text-muted-foreground hover:text-[#8B5CF6] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>
      );
    case 'image':
      return (
        <div className="space-y-2">
          {content.title && <h4 className="font-semibold text-sm">{content.title}</h4>}
          <img 
            src={content.content.url} 
            alt={content.content.alt || content.title || ''} 
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      );
    case 'address':
      return (
        <div className="text-sm text-muted-foreground space-y-1">
          {content.title && <h4 className="font-semibold">{content.title}</h4>}
          <p>{content.content.street}</p>
          <p>{content.content.city}, {content.content.state} {content.content.zip}</p>
          {content.content.phone && <p>Phone: {content.content.phone}</p>}
          {content.content.email && (
            <a 
              href={`mailto:${content.content.email}`}
              className="hover:text-[#8B5CF6]"
            >
              {content.content.email}
            </a>
          )}
        </div>
      );
    case 'social':
      return (
        <div className="space-y-2">
          {content.title && <h4 className="font-semibold text-sm">{content.title}</h4>}
          <div className="flex gap-4">
            {content.content.links?.map((link: { platform: string; url: string }, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#8B5CF6] transition-colors"
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}