import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface StarButtonProps {
  quoteId: string;
  initialStarCount?: number;
}

export function StarButton({ quoteId, initialStarCount = 0 }: StarButtonProps) {
  const user = useUser();
  const { toast } = useToast();
  const [isStarred, setIsStarred] = useState(false);

  // Fetch star count
  const { data: starCount = initialStarCount, refetch: refetchStars } = useQuery({
    queryKey: ['quoteStars', quoteId],
    queryFn: async () => {
      const { count } = await supabase
        .from('quote_stars')
        .select('*', { count: 'exact', head: true })
        .eq('quote_id', quoteId);
      return count || 0;
    },
    enabled: !!quoteId,
  });

  // Check if user has starred (only if authenticated)
  useEffect(() => {
    if (user && quoteId) {
      const checkStarStatus = async () => {
        const { data } = await supabase
          .from('quote_stars')
          .select('id')
          .eq('quote_id', quoteId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        setIsStarred(!!data);
      };

      checkStarStatus();
    }
  }, [user, quoteId]);

  const handleStar = async () => {
    if (!quoteId) return;

    try {
      await supabase
        .from('quote_stars')
        .insert({ 
          quote_id: quoteId,
          user_id: user?.id // Optional user_id
        });
      
      setIsStarred(true);
      refetchStars();
      
    } catch (error) {
      console.error('Error toggling star:', error);
      toast({
        title: "Error",
        description: "Failed to star the quote",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={handleStar}
    >
      <Star className={isStarred ? 'fill-current' : ''} />
      <span>{starCount}</span>
    </Button>
  );
}