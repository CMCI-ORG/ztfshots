import { AppStore, Facebook, Twitter, Instagram, Globe, Mail, Rss } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

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
      return data;
    },
  });

  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo, Tagline, and Store Links */}
          <div className="space-y-6">
            <div className="space-y-4">
              {siteSettings?.logo_url ? (
                <img 
                  src={siteSettings.logo_url} 
                  alt={siteSettings?.site_name || "ZTFBooks"} 
                  className="h-8 w-auto"
                />
              ) : (
                <h3 className="text-lg font-semibold text-[#8B5CF6]">
                  {siteSettings?.site_name || "#ZTFBooks"}
                </h3>
              )}
              <p className="text-sm text-muted-foreground">
                {siteSettings?.tag_line || "Daily inspiration for your spiritual journey"}
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#8B5CF6]"
                >
                  <AppStore className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#8B5CF6]"
                >
                  <Globe className="h-6 w-6" />
                </a>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h4 className="font-semibold">Latest Updates</h4>
              <Link to="/rss" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-[#8B5CF6]">
                <Rss className="h-4 w-4" />
                <span>RSS Feed</span>
              </Link>
            </div>
          </div>
          
          {/* Column 2: Useful Links */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {footerSettings?.column_2_title || "Useful Links"}
              </h3>
              <nav className="flex flex-col space-y-2">
                {footerSettings?.column_2_links?.map((link: any) => (
                  <Link 
                    key={link.url}
                    to={link.url} 
                    className="text-sm text-muted-foreground hover:text-[#8B5CF6]"
                  >
                    {link.title}
                  </Link>
                ))}
              </nav>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h4 className="font-semibold">Resources</h4>
              <Link to="/useful-links/rss" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-[#8B5CF6]">
                <Rss className="h-4 w-4" />
                <span>RSS Feed</span>
              </Link>
            </div>
          </div>
          
          {/* Column 3: Quick Links */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {footerSettings?.column_3_title || "Quick Links"}
              </h3>
              <nav className="flex flex-col space-y-2">
                {footerSettings?.column_3_links?.map((link: any) => (
                  <Link 
                    key={link.url}
                    to={link.url} 
                    className="text-sm text-muted-foreground hover:text-[#8B5CF6]"
                  >
                    {link.title}
                  </Link>
                ))}
              </nav>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h4 className="font-semibold">Categories</h4>
              <Link to="/categories/rss" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-[#8B5CF6]">
                <Rss className="h-4 w-4" />
                <span>RSS Feed</span>
              </Link>
            </div>
          </div>
          
          {/* Column 4: Connect With Us */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {footerSettings?.column_4_title || "Connect With Us"}
              </h3>
              <div className="space-y-4">
                {footerSettings?.column_4_contact_email && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Mail className="h-5 w-5" />
                    <a href={`mailto:${footerSettings.column_4_contact_email}`} className="hover:text-[#8B5CF6]">
                      {footerSettings.column_4_contact_email}
                    </a>
                  </div>
                )}
                <div className="flex space-x-4">
                  {footerSettings?.column_4_social_links?.map((social: any) => {
                    const Icon = {
                      Twitter: Twitter,
                      Facebook: Facebook,
                      Instagram: Instagram,
                      Website: Globe,
                    }[social.platform] || Globe;

                    return (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-[#8B5CF6]"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h4 className="font-semibold">Social Updates</h4>
              <Link to="/social/rss" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-[#8B5CF6]">
                <Rss className="h-4 w-4" />
                <span>RSS Feed</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ZTF Books. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};