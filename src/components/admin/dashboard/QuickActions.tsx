import { Button } from "@/components/ui/button";
import { Plus, Star, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Button 
        variant="outline" 
        className="h-24"
        onClick={() => navigate("/admin/quotes/new")}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New Quote
      </Button>
      
      <Button 
        variant="outline" 
        className="h-24"
        onClick={() => navigate("/admin/quotes/featured")}
      >
        <Star className="mr-2 h-4 w-4" />
        Manage Featured Quotes
      </Button>
      
      <Button 
        variant="outline" 
        className="h-24"
        onClick={() => navigate("/admin/feedback")}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        View User Feedback
      </Button>
    </div>
  );
};