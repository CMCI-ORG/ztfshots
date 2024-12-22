import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShareableQuote } from "./ShareableQuote";
import { Download, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

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
  const { toast } = useToast();

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

  const handleShare = async () => {
    try {
      const element = document.getElementById("shareable-quote");
      if (!element) return;

      const canvas = await html2canvas(element);
      const imageBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      // Record the share event
      await supabase
        .from('quote_shares')
        .insert({ 
          quote_id: quoteId,
          user_id: user?.id,
          share_type: 'card'
        });

      if (navigator.share) {
        try {
          const file = new File([imageBlob], 'quote.png', { type: 'image/png' });
          await navigator.share({
            title: `Quote by ${author}`,
            text: `"${quote}" - ${author}`,
            files: [file]
          });
        } catch (shareError) {
          // Fallback to basic share if file sharing fails
          await navigator.share({
            title: `Quote by ${author}`,
            text: `"${quote}" - ${author}`,
            url: window.location.href
          });
        }
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`"${quote}" - ${author}`);
        toast({
          title: "Quote copied!",
          description: "The quote has been copied to your clipboard.",
        });
      }

      onShare?.();
    } catch (error) {
      console.error('Failed to share:', error);
      toast({
        title: "Error",
        description: "Failed to share the quote",
        variant: "destructive",
      });
    }
  };

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
          <div className="flex justify-center gap-4">
            <Button onClick={handleDownload} className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};