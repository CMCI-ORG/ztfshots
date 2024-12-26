import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FooterColumn } from "./FooterColumn";
import { FooterLogo } from "./FooterLogo";
import { FooterLinks } from "./FooterLinks";
import { FooterSocial } from "./FooterSocial";
import { FooterSettings, FooterLink, SocialLink } from "./types";
import { FooterContent, FooterContentType } from "@/components/admin/settings/footer/types";

export const Footer = () => {
  const { data: siteSettings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const { data: footerSettings } = useQuery({
    queryKey: ['footerSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('footer_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;

      return {
        ...data,
        column_2_links: data?.column_2_links as FooterLink[] ?? [],
        column_3_links: data?.column_3_links as FooterLink[] ?? [],
        column_4_social_links: data?.column_4_social_links as SocialLink[] ?? []
      } as FooterSettings;
    },
  });

  const { data: footerContents } = useQuery({
    queryKey: ['footerContents'],
    queryFn: async () => {
      const { data: contents, error: contentsError } = await supabase
        .from('footer_contents')
        .select('*')
        .order('order_position');

      if (contentsError) throw contentsError;

      const { data: contentTypes, error: typesError } = await supabase
        .from('footer_content_types')
        .select('*');

      if (typesError) throw typesError;

      const { data: columns, error: columnsError } = await supabase
        .from('footer_columns')
        .select('*')
        .order('position');

      if (columnsError) throw columnsError;

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

      switch (contentType.type) {
        case 'text':
          return (
            <div key={content.id} className="text-sm text-muted-foreground">
              {content.title && <h4 className="font-semibold mb-2">{content.title}</h4>}
              <p>{content.content.text}</p>
            </div>
          );
        case 'link':
          return (
            <div key={content.id}>
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
        case 'image':
          return (
            <div key={content.id} className="space-y-2">
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
            <div key={content.id} className="text-sm text-muted-foreground space-y-1">
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
            <div key={content.id} className="space-y-2">
              {content.title && <h4 className="font-semibold text-sm">{content.title}</h4>}
              <div className="flex gap-4">
                {content.content.links?.map((link: { platform: string; url: string }, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[#8B5CF6]"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {footerContents?.columns.map(column => (
            <div key={column.id} className="space-y-4">
              {column.position === 1 && (
                <FooterLogo 
                  logoUrl={siteSettings?.logo_url}
                  siteName={siteSettings?.site_name}
                  tagLine={siteSettings?.tag_line}
                  playstoreLink={footerSettings?.column_1_playstore_link}
                />
              )}
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