import { FooterContent, FooterContentType } from "@/components/admin/settings/footer/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { TextContent } from "./content-renderers/TextContent";
import { LinkContent } from "./content-renderers/LinkContent";
import { FeedContent } from "./content-renderers/FeedContent";
import { SocialContent } from "./content-renderers/SocialContent";
import { AddressContent } from "./content-renderers/AddressContent";
import { ImageContent } from "./content-renderers/ImageContent";
import { LinksContent } from "./content-renderers/LinksContent";

interface FooterContentRendererProps {
  content: FooterContent;
  contentType: FooterContentType;
}

// Type guard to check if content has required address fields
const isValidAddressContent = (content: Record<string, any>): content is {
  street: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  email?: string;
} => {
  return (
    typeof content.street === 'string' &&
    typeof content.city === 'string' &&
    typeof content.state === 'string' &&
    typeof content.zip === 'string'
  );
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
          <TextContent 
            title={content.title} 
            text={content.content.text} 
          />
        );

      case 'link':
        return (
          <LinkContent 
            title={content.title}
            url={content.content.url}
            text={content.content.text}
          />
        );

      case 'links':
        if (!Array.isArray(content.content.links)) {
          console.warn('Invalid links structure:', content.content);
          return null;
        }
        return <LinksContent links={content.content.links} title={content.title} />;

      case 'feed':
        return (
          <FeedContent 
            title={content.title}
            rssUrl={content.content.rss_url}
            maxItems={content.content.max_items}
          />
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
        if (!isValidAddressContent(content.content)) {
          console.warn('Invalid address content structure:', content.content);
          return (
            <Alert>
              <AlertDescription>
                Invalid address content structure
              </AlertDescription>
            </Alert>
          );
        }
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