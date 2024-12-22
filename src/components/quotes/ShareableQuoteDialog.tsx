import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShareableQuote } from "./ShareableQuote";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";

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
  const { user } = useAuth();

  // Fetch download count
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

  const handleDownload = async () => {
    if (quoteId) {
      await supabase
        .from('quote_downloads')
        .insert({ 
          quote_id: quoteId,
          user_id: user?.id
        });
    }
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
            onDownload={handleDownload}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};