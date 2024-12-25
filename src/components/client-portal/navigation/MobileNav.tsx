import { Link } from "react-router-dom";
import { Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface MobileNavProps {
  isAdmin: boolean;
}

export const MobileNav = ({ isAdmin }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 sm:h-10 sm:w-10"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className="w-[80vw] sm:w-[280px]"
          onInteractOutside={() => setIsOpen(false)}
          onEscapeKeyDown={() => setIsOpen(false)}
        >
          <nav className="flex flex-col gap-4 mt-8">
            <Link 
              to="/" 
              className="text-base sm:text-lg font-semibold hover:text-[#8B5CF6] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/quotes" 
              className="text-base sm:text-lg font-semibold hover:text-[#8B5CF6] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Explore Quotes
            </Link>
            <Link 
              to="/about" 
              className="text-base sm:text-lg font-semibold hover:text-[#8B5CF6] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-base sm:text-lg font-semibold hover:text-[#8B5CF6] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-base sm:text-lg font-semibold flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Admin Portal
              </Link>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};