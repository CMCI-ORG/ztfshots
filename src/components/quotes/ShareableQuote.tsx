import { Card, CardContent } from "@/components/ui/card";
import { QuoteAvatar } from "./shareable/QuoteAvatar";
import { QuoteContent } from "./shareable/QuoteContent";

interface ShareableQuoteProps {
  quote: string;
  author: string;
  backgroundStyle?: string;
  aspectRatio?: string;
  sourceTitle?: string;
  sourceUrl?: string;
  onDownload?: () => void;
  authorImageUrl?: string;
}

export const ShareableQuote = ({ 
  quote, 
  author, 
  backgroundStyle,
  aspectRatio = "1/1",
  sourceTitle,
  onDownload,
  authorImageUrl
}: ShareableQuoteProps) => {
  const colorScheme = {
    bg: "#E5DEFF",
    text: "#1A1F2C"
  };
  
  const finalBackground = backgroundStyle || colorScheme.bg;
  const textColor = backgroundStyle ? "#1A1F2C" : colorScheme.text;

  const getMaxWidth = () => {
    if (aspectRatio === "9/16") {
      return {
        width: "min(90vw, 400px)",
        height: "min(160vw, 711px)"
      };
    }
    return {
      width: "min(90vw, 400px)",
      height: "min(90vw, 400px)"
    };
  };

  const dimensions = getMaxWidth();

  return (
    <Card
      id="shareable-quote"
      className="relative overflow-hidden mx-auto"
      style={{
        background: finalBackground,
        width: dimensions.width,
        height: dimensions.height
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
      <CardContent className="relative h-full flex flex-col items-center justify-between p-4 md:p-6 text-center">
        <QuoteAvatar author={author} authorImageUrl={authorImageUrl} />
        <QuoteContent 
          quote={quote}
          author={author}
          sourceTitle={sourceTitle}
          textColor={textColor}
        />
        <p 
          className="text-xs absolute bottom-2"
          style={{ color: textColor }}
        >
          ztfbooks.com
        </p>
      </CardContent>
    </Card>
  );
};