import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export const Navbar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in">
      <div className="flex h-14 items-center px-4 gap-4">
        <h2 className="text-lg font-semibold hidden md:block animate-fade-in">QuoteVerse</h2>
        <div className="flex-1">
          <div className="w-full max-w-sm animate-fade-in [animation-delay:150ms]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search quotes..." className="pl-8" />
            </div>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 animate-fade-in [animation-delay:300ms]">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/profile")}
                className="transition-colors duration-300 hover:bg-accent"
              >
                Profile
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="transition-colors duration-300 hover:bg-destructive hover:text-destructive-foreground"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden animate-fade-in [animation-delay:300ms]">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 transition-transform duration-300 hover:scale-110">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[280px]">
              <nav className="flex flex-col gap-4 mt-8">
                {user ? (
                  <>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start transition-colors duration-300 hover:bg-accent" 
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start transition-colors duration-300 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
                    onClick={() => navigate("/login")}
                  >
                    Sign In
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};