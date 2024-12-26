import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import html2canvas from "html2canvas";

export const useShareableQuote = (quoteId: string, quote: string, author: string) => {
  const { user } = useAuth();
  const { toast } = useToast();

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
          await navigator.share({
            title: `Quote by ${author}`,
            text: `"${quote}" - ${author}`,
            url: window.location.href
          });
        }
      } else {
        await navigator.clipboard.writeText(`"${quote}" - ${author}`);
        toast({
          title: "Quote copied!",
          description: "The quote has been copied to your clipboard.",
        });
      }
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
  };

  return { handleShare, handleDownload };
};