import { Button } from "@/components/ui/button";
import { Star, Clock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickLinks = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Button
          variant="outline"
          className="h-24 bg-white/80 backdrop-blur-sm hover:bg-white/90"
          onClick={() => navigate("/quotes/highly-rated")}
        >
          <Star className="mr-2 h-5 w-5 text-[#8B5CF6]" />
          Highly Rated
        </Button>
        <Button
          variant="outline"
          className="h-24 bg-white/80 backdrop-blur-sm hover:bg-white/90"
          onClick={() => navigate("/quotes/recent")}
        >
          <Clock className="mr-2 h-5 w-5 text-[#8B5CF6]" />
          Recent Quotes
        </Button>
        <Button
          variant="outline"
          className="h-24 bg-white/80 backdrop-blur-sm hover:bg-white/90"
          onClick={() => navigate("/quotes/featured")}
        >
          <Sparkles className="mr-2 h-5 w-5 text-[#8B5CF6]" />
          Featured Quotes
        </Button>
      </div>
    </div>
  );
};