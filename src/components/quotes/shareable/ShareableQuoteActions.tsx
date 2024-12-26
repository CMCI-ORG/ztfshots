import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

interface ShareableQuoteActionsProps {
  onDownload: () => void;
  onShare: () => void;
}

export const ShareableQuoteActions = ({ onDownload, onShare }: ShareableQuoteActionsProps) => {
  return (
    <div className="flex justify-center gap-4">
      <Button onClick={onDownload} className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      <Button variant="outline" onClick={onShare}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    </div>
  );
};