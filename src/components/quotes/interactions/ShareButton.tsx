import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ShareButtonProps {
  quoteId: string;
  onShare: () => void;
}

export const ShareButton = ({ quoteId, onShare }: ShareButtonProps) => {
  const handleShare = async () => {
    try {
      await supabase
        .from('quote_shares')
        .insert({ 
          quote_id: quoteId,
          share_type: 'quick'
        });
      onShare();
    } catch (error) {
      console.error('Failed to record share:', error);
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