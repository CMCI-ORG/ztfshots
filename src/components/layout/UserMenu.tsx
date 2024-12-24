import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { User, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserMenu = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  if (!user) {
    return (
      <Button 
        variant="outline" 
        onClick={() => navigate("/login")}
        className="text-sm sm:text-base py-1 px-3 sm:py-2 sm:px-4 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
      >
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full">
          <User className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 sm:w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-xs sm:text-sm font-medium leading-none truncate">{user.email}</p>
            <Badge variant={profile?.role === "admin" || profile?.role === "superadmin" ? "default" : "secondary"} className="w-fit text-xs">
              {profile?.role || "user"}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")} className="text-sm">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="text-sm">
          <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Sign Out
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => navigate("/delete-account")}
          className="text-destructive focus:text-destructive text-sm"
        >
          <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Delete Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};