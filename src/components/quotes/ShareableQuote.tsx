import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import html2canvas from "html2canvas";

interface ShareableQuoteProps {
  quote: string;
  author: string;
  backgroundStyle?: string;
  aspectRatio?: string;
}

export const ShareableQuote = ({ 
  quote, 
  author, 
  backgroundStyle = "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)", 
  aspectRatio = "1/1" 
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
        <div className="absolute inset-0 bg-black/10" />
        <CardContent className="relative h-full flex flex-col items-center justify-center p-6 text-center">
          <blockquote className="text-xl md:text-2xl font-serif italic mb-4 text-gray-800">"{quote}"</blockquote>
          <footer className="text-sm md:text-base font-medium text-gray-700">— {author}</footer>
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