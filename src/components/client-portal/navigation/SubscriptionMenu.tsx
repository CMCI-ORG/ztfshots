import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const SubscriptionMenu = () => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="outline" 
      className="border-[#33A1DE] text-[#33A1DE] hover:bg-[#33A1DE]/10"
      onClick={() => navigate("/subscribe")}
    >
      Subscribe
    </Button>
  );
};