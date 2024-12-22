import { Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { InteractionButton } from "./InteractionButton";
import { useIsMobile } from "@/hooks/use-mobile";

interface ShareButtonProps {
  quoteId: string;
  quote: string;
  author: string;
}

export const ShareButton = ({ quoteId, quote, author }: ShareButtonProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const { data: sharesCount, refetch: refetchShares } = useQuery({
    queryKey: ["quote-shares", quoteId],
    queryFn: async () => {
      if (!quoteId) return 0;
      const { count } = await supabase
        .from('quote_shares')
        .select('*', { count: 'exact' })
        .eq('quote_id', quoteId);
      return count || 0;
    },
    enabled: !!quoteId,
  });

  const handleShare = async () => {
    try {
      // Record the share event if we have a quote ID
      if (quoteId) {
        await supabase
          .from('quote_shares')
          .insert({ 
            quote_id: quoteId,
            user_id: user?.id,
            share_type: 'quick'
          });
      }

      // Use Web Share API on mobile if available
      if (isMobile && navigator.share) {
        await navigator.share({
          title: `Quote by ${author}`,
          text: `"${quote}" - ${author}`,
          url: window.location.href,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`"${quote}" - ${author}`);
        toast({
          title: "Quote copied!",
          description: "The quote has been copied to your clipboard.",
        });
      }

      if (quoteId) {
        refetchShares();
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Failed to share:', error);
        toast({
          title: "Error",
          description: "Failed to share the quote",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <InteractionButton 
      onClick={handleShare}
      count={sharesCount}
    >
      <Share2 className="h-4 w-4" />
    </InteractionButton>
  );
};