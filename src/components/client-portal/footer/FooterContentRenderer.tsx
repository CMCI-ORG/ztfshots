import { Facebook, Twitter, Instagram, Youtube, Globe, ExternalLink, Rss, Link2 } from "lucide-react";
import { FooterContent, FooterContentType } from "@/components/admin/settings/footer/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { RSSFeedContent } from "./RSSFeedContent";
import { LinkContent } from "./content-types/LinkContent";

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
  const { toast } = useToast();
  console.log("Rendering content:", { content, contentType });

  const handleError = (error: Error, contentType: string) => {
    console.error(`Error rendering ${contentType} content:`, error);
    toast({
      variant: "destructive",
      title: "Error displaying content",
      description: `Failed to display ${contentType} content. Please try refreshing the page.`
    });
  };

  try {
    switch (contentType.type) {
      case 'text':
        return (
          <div className="space-y-2">
            {content.title && (
              <h4 className="font-bold text-base text-foreground">{content.title}</h4>
            )}
            <p className="text-sm text-muted-foreground">{content.content.text}</p>
          </div>
        );

      case 'link':
        return (
          <div className="space-y-2">
            {content.title && (
              <h4 className="font-bold text-base text-foreground">{content.title}</h4>
            )}
            <a 
              href={content.content.url} 
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Link2 className="h-4 w-4" />
              {content.content.text || content.title}
            </a>
          </div>
        );

      case 'links':
        if (!Array.isArray(content.content.links)) {
          console.warn('Invalid links structure:', content.content);
          return null;
        }
        return (
          <div className="space-y-4">
            {content.title && (
              <h4 className="font-bold text-base text-foreground">{content.title}</h4>
            )}
            <div className="space-y-2">
              {content.content.links.map((link: { text: string; url: string }, index: number) => (
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

      case 'feed':
        return (
          <div className="space-y-4">
            {content.title && (
              <h4 className="font-bold text-base text-foreground">{content.title}</h4>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Rss className="h-4 w-4" />
              <span className="text-sm">RSS Feed</span>
            </div>
            <RSSFeedContent 
              url={content.content.rss_url} 
              maxItems={content.content.max_items || 5} 
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            {content.title && (
              <h4 className="font-bold text-base text-foreground">{content.title}</h4>
            )}
            <img 
              src={content.content.url} 
              alt={content.content.alt || content.title || ''} 
              className="max-w-full h-auto rounded-lg"
              onError={(e) => {
                console.error('Failed to load image:', content.content.url);
                e.currentTarget.style.display = 'none';
                toast({
                  variant: "destructive",
                  title: "Error loading image",
                  description: "Failed to load image. Please check the URL and try again."
                });
              }}
            />
          </div>
        );

      case 'address':
        return (
          <div className="space-y-4">
            {content.title && (
              <h4 className="font-bold text-base text-foreground">{content.title}</h4>
            )}
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{content.content.street}</p>
              <p>{content.content.city}, {content.content.state} {content.content.zip}</p>
              {content.content.phone && <p>Phone: {content.content.phone}</p>}
              {content.content.email && (
                <a 
                  href={`mailto:${content.content.email}`}
                  className="hover:text-primary"
                >
                  {content.content.email}
                </a>
              )}
            </div>
          </div>
        );

      case 'social':
        if (!Array.isArray(content.content.links)) {
          console.warn('Invalid social links structure:', content.content);
          return null;
        }
        return (
          <div className="space-y-4">
            {content.title && (
              <h4 className="font-bold text-base text-foreground">{content.title}</h4>
            )}
            <div className="flex gap-4">
              {content.content.links?.map((link: { platform: string; url: string }, index: number) => (
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

      default:
        console.warn('Unknown content type:', contentType.type);
        return (
          <Alert>
            <AlertDescription>
              Unsupported content type: {contentType.type}
            </AlertDescription>
          </Alert>
        );
    }
  } catch (error) {
    handleError(error as Error, contentType.type);
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to display content
        </AlertDescription>
      </Alert>
    );
  }
}