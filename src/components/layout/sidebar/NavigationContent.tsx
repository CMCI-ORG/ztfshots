import { ExternalLink, Home, Quote, Users, BookOpen, Mail, Settings2, MessageSquare, Bell, LayoutDashboard, FileText, Rss, GitPullRequest } from "lucide-react";
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
  {
    title: "Content Management",
    icon: LayoutDashboard,
    items: [
      { title: "Footer", url: "/admin/content/footer" },
      { title: "Feed", url: "/admin/content/feed", icon: Rss },
      { title: "Pages", url: "/admin/content/pages", icon: FileText },
      { title: "Home Page", url: "/admin/content/home" },
    ]
  },
  {
    title: "Development",
    icon: GitPullRequest,
    items: [
      { title: "Releases", url: "/admin/development/releases" },
      { title: "Roadmap", url: "/admin/development/roadmap" },
    ]
  },
  { title: "Settings", icon: Settings2, url: "/admin/settings" },
];

const externalItems: MenuItem[] = [
  { 
    title: "Client Portal", 
    icon: ExternalLink, 
    url: "/",
    target: "_blank",
    rel: "noopener noreferrer"
  },
];

export const NavigationContent = () => {
  return (
    <SidebarGroup>
      <NavigationGroup label="Navigation" items={menuItems} />
      <NavigationGroup 
        label="External Links" 
        items={externalItems} 
      />
    </SidebarGroup>
  );
};