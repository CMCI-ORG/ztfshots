import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useMatches, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const MetaUpdater = () => {
  const matches = useMatches();
  const location = useLocation();
  
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
      // Get route-specific metadata
      const currentRoute = matches[matches.length - 1];
      const routeMeta = currentRoute?.handle?.meta;
      
      // Set title and description based on route metadata or fallback to site settings
      const title = routeMeta?.title || siteSettings.site_name;
      const description = routeMeta?.description || siteSettings.description || '';
      
      // Update basic meta tags
      document.title = title;
      
      const metaTags = {
        description,
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
        'og:title': title,
        'og:description': description,
        'og:image': siteSettings.cover_image_url || '',
        'og:type': 'website',
        'og:site_name': siteSettings.site_name,
        'og:url': window.location.href,
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
        'twitter:title': title,
        'twitter:description': description,
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
  }, [siteSettings, location.pathname, matches]);

  return null;
};