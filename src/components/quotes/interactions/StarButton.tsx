import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface StarButtonProps {
  quoteId: string;
  initialStars?: number;
}

export const StarButton = ({ quoteId, initialStars = 0 }: StarButtonProps) => {
  const { toast } = useToast();
  const [stars, setStars] = useState(initialStars);
  const [isStarred, setIsStarred] = useState(false);

  const handleStar = async () => {
    try {
      if (isStarred) {
        await supabase
          .from('quote_stars')
          .delete()
          .eq('quote_id', quoteId);
        setStars(prev => prev - 1);
      } else {
        await supabase
          .from('quote_stars')
          .insert({ quote_id: quoteId });
        setStars(prev => prev + 1);
      }
      setIsStarred(!isStarred);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update star status",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`text-gray-600 hover:text-[#8B5CF6] ${isStarred ? 'text-[#8B5CF6]' : ''}`}
      onClick={handleStar}
    >
      <Star className="h-4 w-4" />
      <span className="ml-1 text-xs">{stars}</span>
    </Button>
  );
};