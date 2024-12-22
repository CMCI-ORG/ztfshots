import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShareableQuote } from "./ShareableQuote";
import { Download } from "lucide-react";

interface ShareableQuoteDialogProps {
  quote: string;
  author: string;
  sourceTitle?: string;
  onDownload?: () => void;
  onShare?: () => void;
}

export const ShareableQuoteDialog = ({ 
  quote, 
  author, 
  sourceTitle,
  onDownload,
  onShare 
}: ShareableQuoteDialogProps) => {
  const [size, setSize] = useState<"square" | "story">("square");
  const [style, setStyle] = useState<"gradient" | "minimal" | "book">("minimal");

  const backgrounds = {
    gradient: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
    minimal: undefined,
    book: "linear-gradient(to right, #d7d2cc 0%, #304352 100%)"
  };

  const handleDownload = () => {
    onDownload?.();
  };

  const handleDialogOpen = (open: boolean) => {
    if (open) {
      onShare?.();
    }
  };

  return (
    <Dialog onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#8B5CF6]">
          <Download className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Download Quote Card</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="space-y-4">
            <Label>Card Size</Label>
            <RadioGroup defaultValue={size} onValueChange={(value) => setSize(value as "square" | "story")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="square" id="square" />
                <Label htmlFor="square">Square (1:1)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="story" id="story" />
                <Label htmlFor="story">Story (9:16)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-4">
            <Label>Style</Label>
            <RadioGroup defaultValue={style} onValueChange={(value) => setStyle(value as "gradient" | "minimal" | "book")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gradient" id="gradient" />
                <Label htmlFor="gradient">Gradient</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="minimal" id="minimal" />
                <Label htmlFor="minimal">Minimal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="book" id="book" />
                <Label htmlFor="book">Book</Label>
              </div>
            </RadioGroup>
          </div>

          <ShareableQuote 
            quote={quote}
            author={author}
            backgroundStyle={backgrounds[style]}
            aspectRatio={size === "square" ? "1/1" : "9/16"}
            sourceTitle={sourceTitle}
            onDownload={handleDownload}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};