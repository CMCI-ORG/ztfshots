import { Facebook, Twitter, Instagram, Globe, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-[#8B5CF6]">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-[#8B5CF6]">
                Terms of Use
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-[#8B5CF6]">
                Contact Us
              </Link>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Mail className="h-5 w-5" />
              <a href="mailto:support@ztfbooks.com" className="hover:text-[#8B5CF6]">
                support@ztfbooks.com
              </a>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/ZTFBooks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#8B5CF6]"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/ZTFBooks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#8B5CF6]"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/ZTFBooks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#8B5CF6]"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://ztfbooks.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#8B5CF6]"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Follow us on social media: #ZTFBooks
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ZTF Books. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};