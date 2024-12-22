import { useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { Share2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ShareableQuoteDialog } from '../../ShareableQuoteDialog';

interface ShareButtonProps {
  quoteId: string;
  quote: string;
  author: string;
}

export function ShareButton({ quoteId, quote, author }: ShareButtonProps) {
  const user = useUser();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch share count
  const { data: shareCount = 0, refetch: refetchShares } = useQuery({
    queryKey: ['quoteShares', quoteId],
    queryFn: async () => {
      const { count } = await supabase
        .from('quote_shares')
        .select('*', { count: 'exact', head: true })
        .eq('quote_id', quoteId);
      return count || 0;
    },
    enabled: !!quoteId,
  });

  const handleQuickShare = async () => {
    if (!quoteId) return;

    try {
      await supabase
        .from('quote_shares')
        .insert({ 
          quote_id: quoteId,
          user_id: user?.id,
          share_type: 'quick'
        });

      if (navigator.share) {
        await navigator.share({
          title: `Quote by ${author}`,
          text: `"${quote}" - ${author}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(`"${quote}" - ${author}`);
        toast({
          title: "Quote copied!",
          description: "The quote has been copied to your clipboard.",
        });
      }

      refetchShares();
      
    } catch (error) {
      console.error('Error sharing quote:', error);
      toast({
        title: "Error",
        description: "Failed to share the quote",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={handleQuickShare}
      >
        <Share2 />
        <span>{shareCount}</span>
      </Button>

      <ShareableQuoteDialog
        quoteId={quoteId}
        quote={quote}
        author={author}
        onShare={handleQuickShare}
      />
    </>
  );
}