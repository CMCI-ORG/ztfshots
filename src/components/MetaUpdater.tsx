import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const MetaUpdater = () => {
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

  useEffect(() => {
    if (siteSettings) {
      // Update basic meta tags
      document.title = siteSettings.site_name;
      
      const metaTags = {
        description: siteSettings.description || '',
        keywords: 'Christian quotes, Z.T. Fomum quotes, spiritual growth, daily inspiration, biblical wisdom, Christian teachings, spiritual transformation, faith journey, Christian leadership, prayer life, discipleship, Christian living',
        author: 'Z.T. Fomum',
        'theme-color': '#8B5CF6',
      };

      Object.entries(metaTags).forEach(([name, content]) => {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('name', name);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      });

      // Update Open Graph meta tags
      const ogTags = {
        'og:title': siteSettings.site_name,
        'og:description': siteSettings.description || '',
        'og:image': siteSettings.cover_image_url || '',
        'og:type': 'website',
        'og:site_name': siteSettings.site_name,
      };

      Object.entries(ogTags).forEach(([property, content]) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      });

      // Update Twitter Card meta tags
      const twitterTags = {
        'twitter:card': 'summary_large_image',
        'twitter:title': siteSettings.site_name,
        'twitter:description': siteSettings.description || '',
        'twitter:image': siteSettings.cover_image_url || '',
      };

      Object.entries(twitterTags).forEach(([name, content]) => {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('name', name);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      });

      // Update canonical URL
      let canonicalTag = document.querySelector('link[rel="canonical"]');
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute('href', window.location.href);
    }
  }, [siteSettings]);

  return null;
};