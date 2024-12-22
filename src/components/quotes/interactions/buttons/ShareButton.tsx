import { useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { Share } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ShareableQuoteDialog } from '../../ShareableQuoteDialog';

interface ShareButtonProps {
  quoteId: string;
  initialShareCount?: number;
}

export function ShareButton({ quoteId, initialShareCount = 0 }: ShareButtonProps) {
  const user = useUser();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch share count
  const { data: shareCount = initialShareCount, refetch: refetchShares } = useQuery({
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
          user_id: user?.id, // Optional user_id
          share_type: 'quick'
        });

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
        onClick={() => setDialogOpen(true)}
      >
        <Share />
        <span>{shareCount}</span>
      </Button>

      <ShareableQuoteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        quoteId={quoteId}
        onShare={handleQuickShare}
      />
    </>
  );
}