import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavigationContent } from "./sidebar/NavigationContent";
import { MobileSidebar } from "./sidebar/MobileSidebar";

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileSidebar />;
  }

  return (
    <Sidebar 
      className={`transition-all duration-300 h-[calc(100vh-4rem)] sticky top-16 ${
        isCollapsed ? 'w-[60px]' : 'w-[280px]'
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-2 z-50 hover:bg-background/50 backdrop-blur-sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ExternalLink className="h-4 w-4 rotate-180 transition-transform duration-200" />
        ) : (
          <ExternalLink className="h-4 w-4 transition-transform duration-200" />
        )}
      </Button>
      <NavigationContent />
    </Sidebar>
  );
}