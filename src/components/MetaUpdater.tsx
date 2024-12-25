import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useMatches, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BasicMetaTags } from "./meta/BasicMetaTags";
import { SocialMetaTags } from "./meta/SocialMetaTags";
import { updateCanonicalUrl, copyImageToOgImage } from "@/utils/metaUtils";

interface RouteMeta {
  title?: string;
  description?: string;
}

interface RouteHandle {
  meta?: RouteMeta;
}

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
      console.log("Fetched site settings:", data);

      // If there's a cover image, copy it to og-image
      if (data?.cover_image_url) {
        await copyImageToOgImage(data.cover_image_url);
      }

      return data;
    },
  });

  useEffect(() => {
    if (siteSettings) {
      // Get route-specific metadata
      const currentRoute = matches[matches.length - 1];
      const routeMeta = (currentRoute?.handle as RouteHandle)?.meta;
      
      // Set title and description based on route metadata or fallback to site settings
      const title = routeMeta?.title || siteSettings.site_name;
      const description = routeMeta?.description || siteSettings.description || '';
      
      // Always use the site's cover image for social sharing
      const coverImageUrl = siteSettings.cover_image_url || '/og-image.png';
      
      console.log("Updating meta tags with cover image:", coverImageUrl);

      // Update all meta tags
      BasicMetaTags({ title, description });
      SocialMetaTags({
        title,
        description,
        coverImageUrl,
        siteName: siteSettings.site_name
      });
      updateCanonicalUrl(window.location.href);
    }
  }, [siteSettings, location.pathname, matches]);

  return null;
};