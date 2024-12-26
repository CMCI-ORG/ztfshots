import { Facebook, Twitter, Instagram, Youtube, Globe, ExternalLink, Rss } from "lucide-react";
import { FooterContent, FooterContentType } from "@/components/admin/settings/footer/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { RSSFeedContent } from "./RSSFeedContent";

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
          <div className="text-sm text-muted-foreground">
            {content.title && <h4 className="font-semibold mb-2">{content.title}</h4>}
            <p>{content.content.text}</p>
          </div>
        );

      case 'link':
        if (!content.content.url) {
          console.warn('Link content missing URL:', content);
          return null;
        }
        return (
          <div>
            <a 
              href={content.content.url} 
              className="text-sm text-muted-foreground hover:text-[#8B5CF6] flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              {content.title || content.content.text}
            </a>
          </div>
        );

      case 'links':
        if (!Array.isArray(content.content.links)) {
          console.warn('Invalid links content structure:', content);
          return null;
        }
        return (
          <div className="space-y-2">
            {content.title && <h4 className="font-semibold text-sm mb-2">{content.title}</h4>}
            <div className="flex flex-col space-y-2">
              {content.content.links?.map((link: { text: string; url: string }, index: number) => (
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

      case 'feed':
        if (!content.content.rss_url) {
          console.warn('Feed content missing RSS URL:', content);
          return null;
        }
        return (
          <div className="space-y-2">
            {content.title && <h4 className="font-semibold text-sm mb-2">{content.title}</h4>}
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
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
        if (!content.content.url) {
          console.warn('Image content missing URL:', content);
          return null;
        }
        return (
          <div className="space-y-2">
            {content.title && <h4 className="font-semibold text-sm">{content.title}</h4>}
            <img 
              src={content.content.url} 
              alt={content.content.alt || content.title || ''} 
              className="max-w-full h-auto rounded-lg"
              onError={(e) => {
                console.error('Failed to load image:', content.content.url);
                e.currentTarget.style.display = 'none';
              }}
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
        if (!Array.isArray(content.content.links)) {
          console.warn('Invalid social links structure:', content);
          return null;
        }
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