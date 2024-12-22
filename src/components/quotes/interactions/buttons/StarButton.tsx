import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { InteractionButton } from "./InteractionButton";

interface StarButtonProps {
  quoteId: string;
}

export const StarButton = ({ quoteId }: StarButtonProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isStarred, setIsStarred] = useState(false);

  const { data: starsCount, refetch: refetchStars } = useQuery({
    queryKey: ["quote-stars", quoteId],
    queryFn: async () => {
      const { count } = await supabase
        .from('quote_stars')
        .select('*', { count: 'exact' })
        .eq('quote_id', quoteId);
      return count || 0;
    },
  });

  useEffect(() => {
    if (user && quoteId) {
      const checkStarStatus = async () => {
        const { data } = await supabase
          .from('quote_stars')
          .select('id')
          .eq('quote_id', quoteId)
          .eq('user_id', user.id)
          .single();
        
        setIsStarred(!!data);
      };
      
      checkStarStatus();
    }
  }, [quoteId, user]);

  const handleStar = async () => {
    try {
      if (isStarred && user) {
        await supabase
          .from('quote_stars')
          .delete()
          .eq('quote_id', quoteId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('quote_stars')
          .insert({ 
            quote_id: quoteId,
            user_id: user?.id 
          });
      }
      
      setIsStarred(!isStarred);
      refetchStars();
      
    } catch (error) {
      console.error('Error toggling star:', error);
      toast({
        title: "Error",
        description: "Failed to update star status",
        variant: "destructive",
      });
    }
  };

  return (
    <InteractionButton 
      onClick={handleStar}
      isActive={isStarred}
      count={starsCount}
    >
      <Star className="h-4 w-4" />
    </InteractionButton>
  );
};