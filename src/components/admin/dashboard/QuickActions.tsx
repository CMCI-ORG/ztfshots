import { Button } from "@/components/ui/button";
import { Plus, Star, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Button 
        variant="outline" 
        className="h-24 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        onClick={() => navigate("/admin/quotes/new")}
      >
        <Plus className="mr-2 h-5 w-5 text-[#8B5CF6]" />
        Add New Quote
      </Button>
      
      <Button 
        variant="outline" 
        className="h-24 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        onClick={() => navigate("/admin/quotes/featured")}
      >
        <Star className="mr-2 h-5 w-5 text-[#8B5CF6]" />
        Manage Featured Quotes
      </Button>
      
      <Button 
        variant="outline" 
        className="h-24 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        onClick={() => navigate("/admin/feedback")}
      >
        <MessageSquare className="mr-2 h-5 w-5 text-[#8B5CF6]" />
        View User Feedback
      </Button>
    </div>
  );
};