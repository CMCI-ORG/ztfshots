import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { InteractionButton } from "./InteractionButton";

interface StarButtonProps {
  quoteId?: string;
}

export const StarButton = ({ quoteId }: StarButtonProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isStarred, setIsStarred] = useState(false);

  const { data: starsCount, refetch: refetchStars } = useQuery({
    queryKey: ["quote-stars", quoteId],
    queryFn: async () => {
      if (!quoteId) return 0;
      const { count } = await supabase
        .from('quote_stars')
        .select('*', { count: 'exact' })
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
  }, [quoteId, user]);

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
    <InteractionButton 
      onClick={handleStar}
      isActive={isStarred}
      count={starsCount}
    >
      <Star className="h-4 w-4" />
    </InteractionButton>
  );
};