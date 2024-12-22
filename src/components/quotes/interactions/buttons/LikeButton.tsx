import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { InteractionButton } from "./InteractionButton";

interface LikeButtonProps {
  quoteId?: string;
}

export const LikeButton = ({ quoteId }: LikeButtonProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  const { data: likesCount, refetch: refetchLikes } = useQuery({
    queryKey: ["quote-likes", quoteId],
    queryFn: async () => {
      if (!quoteId) return 0;
      const { count } = await supabase
        .from('quote_likes')
        .select('*', { count: 'exact' })
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
  }, [quoteId, user]);

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
    <InteractionButton 
      onClick={handleLike}
      isActive={isLiked}
      count={likesCount}
    >
      <Heart className="h-4 w-4" />
    </InteractionButton>
  );
};