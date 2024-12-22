import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface LikeButtonProps {
  quoteId: string;
  initialLikeCount?: number;
}

export function LikeButton({ quoteId, initialLikeCount = 0 }: LikeButtonProps) {
  const user = useUser();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);

  // Fetch like count
  const { data: likeCount = initialLikeCount, refetch: refetchLikes } = useQuery({
    queryKey: ['quoteLikes', quoteId],
    queryFn: async () => {
      const { count } = await supabase
        .from('quote_likes')
        .select('*', { count: 'exact', head: true })
        .eq('quote_id', quoteId);
      return count || 0;
    },
    enabled: !!quoteId,
  });

  // Check if user has liked (only if authenticated)
  useEffect(() => {
    if (user && quoteId) {
      const checkLikeStatus = async () => {
        const { data } = await supabase
          .from('quote_likes')
          .select('id')
          .eq('quote_id', quoteId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        setIsLiked(!!data);
      };

      checkLikeStatus();
    }
  }, [user, quoteId]);

  const handleLike = async () => {
    if (!quoteId) return;

    try {
      await supabase
        .from('quote_likes')
        .insert({ 
          quote_id: quoteId,
          user_id: user?.id // Optional user_id
        });
      
      setIsLiked(true);
      refetchLikes();
      
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to like the quote",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={handleLike}
    >
      <Heart className={isLiked ? 'fill-current' : ''} />
      <span>{likeCount}</span>
    </Button>
  );
}