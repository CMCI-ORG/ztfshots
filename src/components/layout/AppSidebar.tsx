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

const menuItems = [
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
                  className="w-full justify-start"
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
                className="w-full justify-start"
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
          <Button variant="ghost" size="icon" className="fixed top-3 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[280px] p-0">
          <div className="h-full py-4">
            <NavigationContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sidebar 
      className={`transition-all duration-300 h-[calc(100vh-4rem)] sticky top-16 ${
        isCollapsed ? 'w-[60px]' : 'w-[240px]'
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-2 z-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ExternalLink className="h-4 w-4 rotate-180" />
        ) : (
          <ExternalLink className="h-4 w-4" />
        )}
      </Button>
      <NavigationContent />
    </Sidebar>
  );
}