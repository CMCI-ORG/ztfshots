import { updateMetaTag } from "@/utils/metaUtils";

interface SocialMetaTagsProps {
  title: string;
  description: string;
  coverImageUrl: string;
  siteName: string;
}

export const SocialMetaTags = ({ 
  title, 
  description, 
  coverImageUrl,
  siteName 
}: SocialMetaTagsProps) => {
  const ogTags = {
    'og:title': title,
    'og:description': description,
    'og:image': coverImageUrl,
    'og:type': 'website',
    'og:site_name': siteName,
    'og:url': window.location.href,
  };

  const twitterTags = {
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': coverImageUrl,
  };

  Object.entries(ogTags).forEach(([property, content]) => {
    updateMetaTag(property, content || '', true);
  });

  Object.entries(twitterTags).forEach(([name, content]) => {
    updateMetaTag(name, content || '');
  });

  return null;
};