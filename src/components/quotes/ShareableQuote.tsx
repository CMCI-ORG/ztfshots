import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import html2canvas from "html2canvas";

interface ShareableQuoteProps {
  quote: string;
  author: string;
  backgroundImage?: string;
}

export const ShareableQuote = ({ quote, author, backgroundImage = "/placeholder.svg" }: ShareableQuoteProps) => {
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
        className="relative overflow-hidden aspect-square max-w-md mx-auto"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <CardContent className="relative h-full flex flex-col items-center justify-center p-6 text-white text-center">
          <blockquote className="text-xl md:text-2xl font-serif italic mb-4">"{quote}"</blockquote>
          <footer className="text-sm md:text-base font-medium">— {author}</footer>
        </CardContent>
      </Card>
      
      <div className="flex justify-center gap-4">
        <Button onClick={handleDownload}>
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