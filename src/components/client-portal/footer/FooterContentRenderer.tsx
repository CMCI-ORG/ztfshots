import { ExternalLink, Link2, Rss } from "lucide-react";
import { FooterContent, FooterContentType } from "@/components/admin/settings/footer/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { RSSFeedContent } from "./RSSFeedContent";
import { SocialContent } from "./content-renderers/SocialContent";
import { AddressContent } from "./content-renderers/AddressContent";
import { ImageContent } from "./content-renderers/ImageContent";
import { LinksContent } from "./content-renderers/LinksContent";

interface FooterContentRendererProps {
  content: FooterContent;
  contentType: FooterContentType;
}

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
        return <LinksContent links={content.content.links} title={content.title} />;

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
          <ImageContent 
            url={content.content.url} 
            alt={content.content.alt} 
            title={content.title} 
          />
        );

      case 'address':
        return <AddressContent content={content.content} title={content.title} />;

      case 'social':
        if (!Array.isArray(content.content.links)) {
          console.warn('Invalid social links structure:', content.content);
          return null;
        }
        return <SocialContent links={content.content.links} title={content.title} />;

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