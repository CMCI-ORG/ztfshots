import { Button } from "@/components/ui/button";
import { Star, Clock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickLinks = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
        <Button
          variant="outline"
          className="h-24 sm:h-32 bg-white/80 backdrop-blur-sm hover:bg-white/90 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={() => navigate("/quotes/highly-rated")}
        >
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <Star className="h-6 w-6 sm:h-8 sm:w-8 text-[#8B5CF6]" />
            <span className="text-sm sm:text-base font-medium">Highly Rated</span>
          </div>
        </Button>
        <Button
          variant="outline"
          className="h-24 sm:h-32 bg-white/80 backdrop-blur-sm hover:bg-white/90 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={() => navigate("/quotes/recent")}
        >
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-[#8B5CF6]" />
            <span className="text-sm sm:text-base font-medium">Recent Quotes</span>
          </div>
        </Button>
        <Button
          variant="outline"
          className="h-24 sm:h-32 bg-white/80 backdrop-blur-sm hover:bg-white/90 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md col-span-1 sm:col-span-2 lg:col-span-1"
          onClick={() => navigate("/quotes/featured")}
        >
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-[#8B5CF6]" />
            <span className="text-sm sm:text-base font-medium">Featured Quotes</span>
          </div>
        </Button>
      </div>
    </div>
  );
};