import { Button } from "@/components/ui/button";
import { Star, Clock, Sparkles } from "lucide-react";

export const QuickLinks = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button
          variant="outline"
          className="h-24 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        >
          <Star className="mr-2 h-5 w-5 text-[#8B5CF6]" />
          Highly Rated
        </Button>
        <Button
          variant="outline"
          className="h-24 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        >
          <Clock className="mr-2 h-5 w-5 text-[#8B5CF6]" />
          Recent Quotes
        </Button>
        <Button
          variant="outline"
          className="h-24 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        >
          <Sparkles className="mr-2 h-5 w-5 text-[#8B5CF6]" />
          Featured Quotes
        </Button>
      </div>
    </div>
  );
};