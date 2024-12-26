import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useLanguage } from "@/providers/LanguageProvider";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
}

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  const { currentLanguage } = useLanguage();
  
  const { data: siteSettings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching site settings:", error);
        return null;
      }
      return data;
    },
  });

  // Get translated content
  const getTranslatedContent = (field: string) => {
    if (!siteSettings) return "";
    if (currentLanguage === siteSettings.primary_language) {
      return siteSettings[field];
    }
    return siteSettings.translations?.[currentLanguage]?.[field] || siteSettings[field];
  };

  const siteName = getTranslatedContent("site_name");
  const tagLine = getTranslatedContent("tag_line");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto py-4 px-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center space-x-4">
            {siteSettings?.logo_url ? (
              <Link to="/client-portal" className="flex items-center">
                <img 
                  src={siteSettings.logo_url} 
                  alt={siteName} 
                  className="h-12 w-auto"
                />
              </Link>
            ) : (
              <Link to="/client-portal" className="flex items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-[#8B5CF6] font-['Open_Sans']">
                  {siteName}
                </h1>
              </Link>
            )}
          </div>
          {title && (
            <h1 className="text-3xl font-bold text-[#8B5CF6]">{title}</h1>
          )}
          <p className="text-muted-foreground text-sm md:text-base font-['Roboto']">
            {subtitle || tagLine}
          </p>
        </div>
      </div>
    </header>
  );
};