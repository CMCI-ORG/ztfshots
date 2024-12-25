import { supabase } from "@/integrations/supabase/client";

export const updateMetaTag = (
  name: string,
  content: string,
  isProperty: boolean = false
) => {
  const attributeName = isProperty ? 'property' : 'name';
  let tag = document.querySelector(`meta[${attributeName}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attributeName, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

export const updateCanonicalUrl = (url: string) => {
  let canonicalTag = document.querySelector('link[rel="canonical"]');
  if (!canonicalTag) {
    canonicalTag = document.createElement('link');
    canonicalTag.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalTag);
  }
  canonicalTag.setAttribute('href', url);
};

export const copyImageToOgImage = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const { error } = await supabase.storage
      .from('site-assets')
      .upload('og-image.png', blob, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      console.error("Error copying cover image to og-image:", error);
    }
  } catch (err) {
    console.error("Error copying cover image:", err);
  }
};