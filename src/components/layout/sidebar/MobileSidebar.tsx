import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NavigationContent } from "./NavigationContent";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50 hover:bg-background/50 backdrop-blur-sm"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-[280px] p-4 overflow-y-auto"
      >
        <div className="h-full py-2">
          <NavigationContent />
        </div>
      </SheetContent>
    </Sheet>
  );
};