import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Mail, Bell, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SubscriptionMenu = () => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="border-[#33A1DE] text-[#33A1DE] hover:bg-[#33A1DE]/10"
        >
          Subscribe
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => navigate("/subscribe")}
          className="cursor-pointer"
        >
          <Mail className="mr-2 h-4 w-4" />
          <span>Email Subscription</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/subscribe?type=whatsapp")}
          className="cursor-pointer"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          <span>WhatsApp Updates</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/subscribe?type=notifications")}
          className="cursor-pointer"
        >
          <Bell className="mr-2 h-4 w-4" />
          <span>Browser Notifications</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};