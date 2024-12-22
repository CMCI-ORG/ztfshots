import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";

interface LikeButtonProps {
  quoteId: string;
}

export const LikeButton = ({ quoteId }: LikeButtonProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  // Fetch likes count
  const { data: likesCount, refetch: refetchLikes } = useQuery({
    queryKey: ["quote-likes", quoteId],
    queryFn: async () => {
      const { count } = await supabase
        .from('quote_likes')
        .select('*', { count: 'exact' })
        .eq('quote_id', quoteId);
      return count || 0;
    },
  });

  // Check if user has liked
  useEffect(() => {
    if (user) {
      const checkLikeStatus = async () => {
        const { data } = await supabase
          .from('quote_likes')
          .select('id')
          .eq('quote_id', quoteId)
          .eq('user_id', user.id)
          .single();
        
        setIsLiked(!!data);
      };
      
      checkLikeStatus();
    }
  }, [quoteId, user]);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like quotes",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('quote_likes')
          .delete()
          .eq('quote_id', quoteId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('quote_likes')
          .insert({ 
            quote_id: quoteId,
            user_id: user.id 
          });
      }
      
      setIsLiked(!isLiked);
      refetchLikes();
      
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`text-gray-600 hover:text-[#8B5CF6] ${isLiked ? 'text-[#8B5CF6]' : ''}`}
      onClick={handleLike}
    >
      <Heart className="h-4 w-4" />
      {likesCount !== undefined && <span className="ml-1 text-xs">{likesCount}</span>}
    </Button>
  );
};