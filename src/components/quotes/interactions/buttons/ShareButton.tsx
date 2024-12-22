import { Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { InteractionButton } from "./InteractionButton";

interface ShareButtonProps {
  quoteId: string;
  quote: string;
  author: string;
}

export const ShareButton = ({ quoteId, quote, author }: ShareButtonProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: sharesCount, refetch: refetchShares } = useQuery({
    queryKey: ["quote-shares", quoteId],
    queryFn: async () => {
      const { count } = await supabase
        .from('quote_shares')
        .select('*', { count: 'exact' })
        .eq('quote_id', quoteId);
      return count || 0;
    },
  });

  const handleShare = async () => {
    try {
      // Record the share event
      await supabase
        .from('quote_shares')
        .insert({ 
          quote_id: quoteId,
          user_id: user?.id,
          share_type: 'quick'
        });

      // Use Web Share API if available
      if (navigator.share) {
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

      refetchShares();
    } catch (error) {
      console.error('Failed to share:', error);
      toast({
        title: "Error",
        description: "Failed to share the quote",
        variant: "destructive",
      });
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