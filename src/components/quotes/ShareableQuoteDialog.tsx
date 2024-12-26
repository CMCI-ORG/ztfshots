import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShareableQuote } from "./ShareableQuote";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShareableQuoteActions } from "./shareable/ShareableQuoteActions";
import { useShareableQuote } from "./shareable/useShareableQuote";

interface ShareableQuoteDialogProps {
  quote: string;
  author: string;
  quoteId: string;
  sourceTitle?: string;
  onShare?: () => void;
  onDownload?: () => void;
}

export const ShareableQuoteDialog = ({ 
  quote, 
  author, 
  quoteId,
  sourceTitle,
  onDownload,
  onShare 
}: ShareableQuoteDialogProps) => {
  const { data: downloadCount } = useQuery({
    queryKey: ["quote-downloads", quoteId],
    queryFn: async () => {
      if (!quoteId) return 0;
      const { count } = await supabase
        .from('quote_downloads')
        .select('*', { count: 'exact' })
        .eq('quote_id', quoteId);
      return count || 0;
    },
    enabled: !!quoteId,
  });

  const { handleShare, handleDownload } = useShareableQuote(quoteId, quote, author);

  const handleShareClick = () => {
    handleShare();
    onShare?.();
  };

  const handleDownloadClick = () => {
    handleDownload();
    onDownload?.();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#8B5CF6]">
          <Download className="h-4 w-4" />
          {downloadCount !== undefined && <span className="ml-1 text-xs">{downloadCount}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Download Quote Card</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <ShareableQuote 
            quote={quote}
            author={author}
            aspectRatio="1/1"
            sourceTitle={sourceTitle}
            onDownload={handleDownloadClick}
          />
          <ShareableQuoteActions 
            onDownload={handleDownloadClick}
            onShare={handleShareClick}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};