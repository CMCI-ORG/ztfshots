import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

interface DesktopNavProps {
  isAdmin: boolean;
}

export const DesktopNav = ({ isAdmin }: DesktopNavProps) => {
  return (
    <div className="hidden md:block">
      <NavigationMenu>
        <NavigationMenuList className="space-x-2">
          <NavigationMenuItem>
            <Link to="/" className={navigationMenuTriggerStyle()}>
              Home
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/quotes" className={navigationMenuTriggerStyle()}>
              Explore Quotes
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/about" className={navigationMenuTriggerStyle()}>
              About
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/contact" className={navigationMenuTriggerStyle()}>
              Contact
            </Link>
          </NavigationMenuItem>
          {isAdmin && (
            <NavigationMenuItem>
              <Link 
                to="/admin" 
                className={navigationMenuTriggerStyle() + " flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"}
              >
                <Settings className="h-4 w-4" />
                Admin Portal
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};