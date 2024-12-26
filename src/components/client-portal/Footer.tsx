import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FooterContent, FooterContentType } from "@/components/admin/settings/footer/types";
import { FooterContentRenderer } from "./footer/FooterContentRenderer";

export const Footer = () => {
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
      const { data: contents } = await supabase
        .from('footer_contents')
        .select('*')
        .order('order_position');

      const { data: contentTypes } = await supabase
        .from('footer_content_types')
        .select('*');

      const { data: columns } = await supabase
        .from('footer_columns')
        .select('*')
        .order('position');

      return {
        contents: contents as FooterContent[],
        contentTypes: contentTypes as FooterContentType[],
        columns
      };
    }
  });

  const renderDynamicContent = (columnId: string) => {
    if (!footerContents?.contents) return null;

    const columnContents = footerContents.contents
      .filter(content => content.column_id === columnId)
      .sort((a, b) => a.order_position - b.order_position);

    return columnContents.map(content => {
      const contentType = footerContents.contentTypes.find(
        type => type.id === content.content_type_id
      );

      if (!contentType) return null;

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {footerContents?.columns.map(column => (
            <div key={column.id} className="space-y-4">
              {renderDynamicContent(column.id)}
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ZTF Books. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};