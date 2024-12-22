import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import html2canvas from "html2canvas";

interface ShareableQuoteProps {
  quote: string;
  author: string;
  backgroundStyle?: string;
  aspectRatio?: string;
  sourceTitle?: string;
}

const backgrounds = [
  "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
  "linear-gradient(to right, #d7d2cc 0%, #304352 100%)",
  "linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)",
  "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)",
  "linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)",
  "linear-gradient(184.1deg, rgba(249,255,182,1) 44.7%, rgba(226,255,172,1) 67.2%)",
  "linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)"
];

export const ShareableQuote = ({ 
  quote, 
  author, 
  backgroundStyle = backgrounds[Math.floor(Math.random() * backgrounds.length)], 
  aspectRatio = "1/1",
  sourceTitle
}: ShareableQuoteProps) => {
  const handleDownload = async () => {
    const element = document.getElementById("shareable-quote");
    if (element) {
      const canvas = await html2canvas(element);
      const link = document.createElement("a");
      link.download = "quote.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="space-y-4">
      <Card
        id="shareable-quote"
        className="relative overflow-hidden mx-auto"
        style={{
          background: backgroundStyle,
          aspectRatio,
          maxWidth: aspectRatio === "1/1" ? "400px" : "300px",
        }}
      >
        <div className="absolute inset-0 bg-black/5" />
        <CardContent className="relative h-full flex flex-col items-center justify-center p-6 text-center">
          <blockquote className="text-xl md:text-2xl font-serif italic mb-4 text-gray-800">"{quote}"</blockquote>
          <footer className="text-sm md:text-base font-medium text-gray-700">— {author}</footer>
          {sourceTitle && (
            <p className="text-xs text-gray-600 mt-2">From: {sourceTitle}</p>
          )}
          <p className="text-xs text-gray-500 mt-4 absolute bottom-2">ztfbooks.com</p>
        </CardContent>
      </Card>
      
      <div className="flex justify-center gap-4">
        <Button onClick={handleDownload} className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
};