import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FooterColumn } from "./footer/FooterColumn";
import { FooterLinks } from "./footer/FooterLinks";
import { FooterSocial } from "./footer/FooterSocial";
import { FooterLogo } from "./footer/FooterLogo";
import { FooterSettings, FooterLink, SocialLink } from "./footer/types";

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

  const { data: footerSettings } = useQuery({
    queryKey: ['footerSettings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('footer_settings')
        .select('*')
        .single();
      
      return {
        ...data,
        column_2_links: (data?.column_2_links || []) as FooterLink[],
        column_3_links: (data?.column_3_links || []) as FooterLink[],
        column_4_social_links: (data?.column_4_social_links || []) as SocialLink[]
      } as FooterSettings;
    },
  });

  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo, Tagline, and Store Links */}
          <FooterColumn position="column_1">
            <FooterLogo 
              logoUrl={siteSettings?.logo_url}
              siteName={siteSettings?.site_name}
              tagLine={siteSettings?.tag_line}
              playstoreLink={footerSettings?.column_1_playstore_link}
            />
          </FooterColumn>
          
          {/* Column 2: Useful Links */}
          <FooterColumn 
            title={footerSettings?.column_2_title || "Useful Links"}
            position="column_2"
          >
            <FooterLinks links={footerSettings?.column_2_links || []} />
          </FooterColumn>
          
          {/* Column 3: Quick Links */}
          <FooterColumn 
            title={footerSettings?.column_3_title || "Quick Links"}
            position="column_3"
          >
            <FooterLinks links={footerSettings?.column_3_links || []} />
          </FooterColumn>
          
          {/* Column 4: Connect With Us */}
          <FooterColumn 
            title={footerSettings?.column_4_title || "Connect With Us"}
            position="column_4"
          >
            <FooterSocial 
              socialLinks={footerSettings?.column_4_social_links || []}
              contactEmail={footerSettings?.column_4_contact_email}
            />
          </FooterColumn>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ZTF Books. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};