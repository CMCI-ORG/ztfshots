import { ExternalLink, Home, Quote, Users, BookOpen, Mail, Settings2, MessageSquare, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarGroup } from "@/components/ui/sidebar";
import { NavigationGroup } from "./NavigationGroup";
import { MenuItem } from "@/components/ui/sidebar/types";

const menuItems: MenuItem[] = [
  { title: "Dashboard", icon: Home, url: "/admin" },
  { title: "Quotes", icon: Quote, url: "/admin/quotes" },
  { title: "Authors", icon: Users, url: "/admin/authors" },
  { title: "Categories", icon: BookOpen, url: "/admin/categories" },
  { title: "User Management", icon: Users, url: "/admin/subscribers" },
  { title: "Notifications", icon: Bell, url: "/admin/notifications" },
  { title: "WhatsApp Templates", icon: MessageSquare, url: "/admin/whatsapp-templates" },
  { title: "Settings", icon: Settings2, url: "/admin/settings" },
];

const externalItems: MenuItem[] = [
  { title: "Client Portal", icon: ExternalLink, url: "/" },
];

export const NavigationContent = () => {
  return (
    <SidebarGroup>
      <NavigationGroup label="Navigation" items={menuItems} />
      <NavigationGroup 
        label="External Links" 
        items={externalItems.map(item => ({
          ...item,
          onClick: () => window.open(item.url, "_blank", "noopener,noreferrer")
        }))} 
      />
    </SidebarGroup>
  );
};