import { updateMetaTag } from "@/utils/metaUtils";

interface BasicMetaTagsProps {
  title: string;
  description: string;
}

export const BasicMetaTags = ({ title, description }: BasicMetaTagsProps) => {
  const metaTags = {
    description,
    keywords: 'Christian quotes, Z.T. Fomum quotes, spiritual growth, daily inspiration, biblical wisdom, Christian teachings, spiritual transformation, faith journey, Christian leadership, prayer life, discipleship, Christian living',
    author: 'Z.T. Fomum',
    'theme-color': '#8B5CF6',
  };

  Object.entries(metaTags).forEach(([name, content]) => {
    updateMetaTag(name, content);
  });

  document.title = title;

  return null;
};