import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface LikeButtonProps {
  quoteId: string;
  initialLikes?: number;
}

export const LikeButton = ({ quoteId, initialLikes = 0 }: LikeButtonProps) => {
  const { toast } = useToast();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await supabase
          .from('quote_likes')
          .delete()
          .eq('quote_id', quoteId);
        setLikes(prev => prev - 1);
      } else {
        await supabase
          .from('quote_likes')
          .insert({ quote_id: quoteId });
        setLikes(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
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
      <ThumbsUp className="h-4 w-4" />
      <span className="ml-1 text-xs">{likes}</span>
    </Button>
  );
};