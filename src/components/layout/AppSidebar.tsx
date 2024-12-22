import {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ExternalLink, Home, Quote, Users, BookOpen, Mail, Settings2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { MenuItem } from "@/components/ui/sidebar/types";

const menuItems: MenuItem[] = [
  { title: "Dashboard", icon: Home, url: "/admin" },
  { title: "Quotes", icon: Quote, url: "/admin/quotes" },
  { title: "Authors", icon: Users, url: "/admin/authors" },
  { title: "Categories", icon: BookOpen, url: "/admin/categories" },
  { title: "Subscribers", icon: Mail, url: "/admin/subscribers" },
  { title: "Settings", icon: Settings2, url: "/admin/settings" },
];

const NavigationContent = () => {
  const navigate = useNavigate();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start transition-colors duration-200"
                  onClick={() => navigate(item.url)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.title}</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>

      <SidebarGroupLabel>External Links</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button 
                variant="ghost"
                className="w-full justify-start transition-colors duration-200"
                onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                <span>Client Portal</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
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