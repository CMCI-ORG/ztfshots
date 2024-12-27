import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

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
  sourceUrl,
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
        <div className="w-24 h-24 rounded-full border-4 border-white/50 shadow-lg overflow-hidden -mt-2">
          <Avatar className="w-full h-full">
            <AvatarImage src={authorImageUrl} alt={author} className="object-cover" />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-4">
            <span className="absolute -top-6 -left-4 text-6xl text-[#33A1DE] opacity-20 font-serif leading-none">"</span>
            <blockquote 
              className="text-base md:text-xl lg:text-2xl font-serif italic"
              style={{ color: textColor }}
            >
              {quote}
            </blockquote>
            <span className="absolute -bottom-4 right-0 text-4xl text-[#33A1DE] opacity-20 font-serif leading-none rotate-180">"</span>
          </div>
          <div className="space-y-2">
            {sourceTitle && (
              <p 
                className="text-xs italic"
                style={{ color: textColor }}
              >
                From: {sourceTitle}
              </p>
            )}
            <footer 
              className="text-sm md:text-base font-medium"
              style={{ color: textColor }}
            >
              — {author}
            </footer>
          </div>
        </div>
        
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