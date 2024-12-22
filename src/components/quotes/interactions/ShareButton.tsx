import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  quoteId: string;
  quote: string;
  author: string;
}

export const ShareButton = ({ quoteId, quote, author }: ShareButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

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
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-gray-600 hover:text-[#8B5CF6]"
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
};