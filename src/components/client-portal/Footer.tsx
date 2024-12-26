import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FooterColumn } from "./footer/FooterColumn";
import { FooterLogo } from "./footer/FooterLogo";
import { FooterLinks } from "./footer/FooterLinks";
import { FooterSocial } from "./footer/FooterSocial";
import { FooterSettings, FooterLink, SocialLink } from "./footer/types";
import { FooterContentRenderer } from "./footer/FooterContentRenderer";
import { useToast } from "@/components/ui/use-toast";
import { FooterContent, FooterContentType } from "@/components/admin/settings/footer/types";

export const Footer = () => {
  const { toast } = useToast();
  
  const { data: siteSettings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      return data;
    },
  });

  const { data: footerContents } = useQuery({
    queryKey: ['footerContents'],
    queryFn: async () => {
      console.log("Fetching footer contents...");
      const { data: contents, error: contentsError } = await supabase
        .from('footer_contents')
        .select('*')
        .order('order_position');

      if (contentsError) {
        console.error("Error fetching footer contents:", contentsError);
        toast({
          variant: "destructive",
          title: "Error loading footer contents",
          description: "Please try refreshing the page",
        });
        throw contentsError;
      }

      const { data: contentTypes, error: typesError } = await supabase
        .from('footer_content_types')
        .select('*');

      if (typesError) {
        console.error("Error fetching content types:", typesError);
        toast({
          variant: "destructive",
          title: "Error loading content types",
          description: "Please try refreshing the page",
        });
        throw typesError;
      }

      const { data: columns, error: columnsError } = await supabase
        .from('footer_columns')
        .select('*')
        .order('position');

      if (columnsError) {
        console.error("Error fetching columns:", columnsError);
        toast({
          variant: "destructive",
          title: "Error loading footer structure",
          description: "Please try refreshing the page",
        });
        throw columnsError;
      }

      // Parse JSON content and fields
      const parsedContents = contents?.map(content => ({
        ...content,
        content: typeof content.content === 'string' ? JSON.parse(content.content) : content.content
      })) as FooterContent[];

      const parsedContentTypes = contentTypes?.map(type => ({
        ...type,
        fields: typeof type.fields === 'string' ? JSON.parse(type.fields) : type.fields
      })) as FooterContentType[];

      console.log("Retrieved footer data:", { parsedContents, parsedContentTypes, columns });
      return { contents: parsedContents, contentTypes: parsedContentTypes, columns };
    }
  });

  const renderDynamicContent = (columnId: string) => {
    if (!footerContents?.contents) {
      console.log("No footer contents available");
      return null;
    }

    const columnContents = footerContents.contents
      .filter(content => content.column_id === columnId)
      .sort((a, b) => a.order_position - b.order_position);

    return columnContents.map(content => {
      const contentType = footerContents.contentTypes.find(
        type => type.id === content.content_type_id
      );

      if (!contentType) {
        console.warn(`Content type not found for content:`, content);
        return null;
      }

      console.log(`Rendering content:`, { content, contentType });
      return (
        <FooterContentRenderer 
          key={content.id} 
          content={content} 
          contentType={contentType} 
        />
      );
    });
  };

  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {footerContents?.columns?.map(column => (
            <FooterColumn 
              key={column.id} 
              position={`column_${column.position}`}
            >
              {renderDynamicContent(column.id)}
            </FooterColumn>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ZTF Books. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};