import { Card, CardContent } from "@/components/ui/card";
import html2canvas from "html2canvas";

const colorSchemes = [
  { bg: "#E5DEFF", text: "#1A1F2C" },
  { bg: "#D3E4FD", text: "#1A1F2C" },
  { bg: "#F2FCE2", text: "#1A1F2C" },
  { bg: "#F1F0FB", text: "#1A1F2C" },
];

const gradients = [
  "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
  "linear-gradient(to right, #d7d2cc 0%, #304352 100%)",
  "linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)",
  "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)",
  "linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)",
  "linear-gradient(184.1deg, rgba(249,255,182,1) 44.7%, rgba(226,255,172,1) 67.2%)",
  "linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)"
];

interface ShareableQuoteProps {
  quote: string;
  author: string;
  backgroundStyle?: string;
  aspectRatio?: string;
  sourceTitle?: string;
  sourceUrl?: string;
  onDownload?: () => void;
}

export const ShareableQuote = ({ 
  quote, 
  author, 
  backgroundStyle,
  aspectRatio = "1/1",
  sourceTitle,
  sourceUrl,
  onDownload
}: ShareableQuoteProps) => {
  const colorScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
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
    <div className="space-y-4">
      <Card
        id="shareable-quote"
        className="relative overflow-hidden mx-auto"
        style={{
          background: finalBackground,
          width: dimensions.width,
          height: dimensions.height
        }}
      >
        <div className="absolute inset-0 bg-black/5" />
        <CardContent className="relative h-full flex flex-col items-center justify-center p-4 md:p-6 text-center">
          <blockquote 
            className="text-base md:text-xl lg:text-2xl font-serif italic mb-4"
            style={{ color: textColor }}
          >
            "{quote}"
          </blockquote>
          <footer 
            className="text-sm md:text-base font-medium"
            style={{ color: textColor }}
          >
            — {author}
          </footer>
          {sourceTitle && (
            <p 
              className="text-xs mt-2"
              style={{ color: textColor }}
            >
              From: {sourceTitle}
            </p>
          )}
          <p 
            className="text-xs mt-4 absolute bottom-2"
            style={{ color: textColor }}
          >
            ztfbooks.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
};